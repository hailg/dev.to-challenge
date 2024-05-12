import { QueryCommand, PutCommand, GetCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { ReturnValue, DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import exp from 'constants';

export class Dao {
  constructor(dynamoDBClient, classType, tableName, partitionKey, sortKey = null) {
    this.dynamoDBClient = dynamoDBClient;
    this.classType = classType;
    this.tableName = tableName;
    this.partitionKey = partitionKey;
    this.sortKey = sortKey;
  }

  async create(item) {
    const now = new Date().getTime();
    item.createdAt = now;
    item.updatedAt = now;
    item.classType = this.classType;
    const command = new PutCommand({
      TableName: this.tableName,
      Item: item
    });
    await this.dynamoDBClient.send(command);
    return item;
  }

  async update(item, conditionExpression, conditionExpressionValues) {
    const now = new Date().getTime();
    item.updatedAt = now;
    const key = {
      [this.partitionKey]: item[this.partitionKey]
    };
    delete item[this.partitionKey];
    if (this.sortKey) {
      key[this.sortKey] = item[this.sortKey];
      delete item[this.sortKey];
    }
    const commandInput = {
      TableName: this.tableName,
      Key: key,
      ReturnValues: ReturnValue.ALL_NEW,
      ConditionExpression: conditionExpression
    };
    const updateExpression = Object.entries(item)
      .filter(([key, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `#${key} = :${key}`)
      .join(', ');
    commandInput.UpdateExpression = `SET ${updateExpression}`;
    commandInput.ExpressionAttributeNames = Object.entries(item)
      .filter(([key, value]) => value !== undefined && value !== null)
      .reduce((acc, [key, value]) => ({ ...acc, [`#${key}`]: key }), {});
    const expressionAttributeValues = Object.entries(item)
      .filter(([key, value]) => value !== undefined && value !== null)
      .reduce((acc, [key, value]) => ({ ...acc, [`:${key}`]: value }), {});
    if (conditionExpressionValues) {
      commandInput.ExpressionAttributeValues = {
        ...expressionAttributeValues,
        ...Object.entries(conditionExpressionValues).reduce((acc, [key, value]) => ({ ...acc, [`:${key}`]: value }), {})
      };
    } else {
      commandInput.ExpressionAttributeValues = expressionAttributeValues;
    }
    const command = new UpdateCommand(commandInput);
    await this.dynamoDBClient.send(command);
    console.log('Updated', commandInput);
    return item;
  }

  async get(partitionKeyValue, sortKeyValue = null) {
    const key = {
      [this.partitionKey]: partitionKeyValue
    };
    if (this.sortKey && sortKeyValue !== undefined && sortKeyValue !== null) {
      key[this.sortKey] = sortKeyValue;
    }
    const commandProps = {
      TableName: this.tableName,
      Key: key
    };
    const command = new GetCommand(commandProps);
    const { Item } = await this.dynamoDBClient.send(command);
    if (!Item || Object.keys(Item).length === 0) {
      return null;
    }
    return Item;
  }

  async query({
    indexName,
    hashKey,
    hashValue,
    rangeKey,
    rangeValue,
    rangeMin,
    rangeMax,
    filterExpression,
    filterExpressionRaw,
    lastEvaluatedKey,
    limit
  }) {
    const commandProps = {
      TableName: this.tableName,
      IndexName: indexName
    };
    commandProps.KeyConditionExpression = `#${hashKey} = :${hashKey}`;
    commandProps.ExpressionAttributeNames = {
      [`#${hashKey}`]: hashKey
    };
    commandProps.ExpressionAttributeValues = {
      [`:${hashKey}`]: hashValue
    };
    if (rangeKey) {
      if (rangeValue) {
        commandProps.KeyConditionExpression += ` AND #${rangeKey} = :${rangeKey}`;
        commandProps.ExpressionAttributeNames[`#${rangeKey}`] = rangeKey;
        commandProps.ExpressionAttributeValues[`:${rangeKey}`] = rangeValue;
      } else if (rangeMin !== undefined && rangeMin !== null && rangeMax !== undefined && rangeMax !== null) {
        commandProps.KeyConditionExpression += ` AND #${rangeKey} BETWEEN :${rangeKey}Min AND :${rangeKey}Max`;
        commandProps.ExpressionAttributeNames[`#${rangeKey}`] = rangeKey;
        commandProps.ExpressionAttributeValues[`:${rangeKey}Min`] = rangeMin;
        commandProps.ExpressionAttributeValues[`:${rangeKey}Max`] = rangeMax;
      } else if (rangeMin !== undefined && rangeMin !== null) {
        commandProps.KeyConditionExpression += ` AND #${rangeKey} >= :${rangeKey}Min`;
        commandProps.ExpressionAttributeNames[`#${rangeKey}`] = rangeKey;
        commandProps.ExpressionAttributeValues[`:${rangeKey}Min`] = rangeMin;
      } else if (rangeMax !== undefined && rangeMax !== null) {
        commandProps.KeyConditionExpression += ` AND #${rangeKey} <= :${rangeKey}Max`;
        commandProps.ExpressionAttributeNames[`#${rangeKey}`] = rangeKey;
        commandProps.ExpressionAttributeValues[`:${rangeKey}Max`] = rangeMax;
      } else {
        throw new Error('Missing range values');
      }
    }

    if (filterExpression) {
      if (!rangeKey || rangeKey !== 'classType') {
        commandProps.FilterExpression = Object.entries({
          ...filterExpression,
          classType: this.classType
        })
          .map(([key, value]) => `#${key} = :${key}`)
          .join(' AND ');
      } else {
        commandProps.FilterExpression = Object.entries({
          filterExpression
        })
          .map(([key, value]) => `#${key} = :${key}`)
          .join(' AND ');
      }
      commandProps.ExpressionAttributeNames = {
        ...commandProps.ExpressionAttributeNames,
        ...Object.entries(filterExpression).reduce((acc, [key, value]) => ({ ...acc, [`#${key}`]: key }), {}),
        '#classType': 'classType'
      };
      commandProps.ExpressionAttributeValues = {
        ...commandProps.ExpressionAttributeValues,
        ...Object.entries(filterExpression).reduce((acc, [key, value]) => ({ ...acc, [`:${key}`]: value }), {}),
        ':classType': this.classType
      };
    } else if (filterExpressionRaw) {
      commandProps.FilterExpression = `(${filterExpressionRaw.filterExpression}) AND #classType = :classType`;
      commandProps.ExpressionAttributeNames = {
        ...commandProps.ExpressionAttributeNames,
        ...filterExpressionRaw.expressionAttributeNames,
        '#classType': 'classType'
      };
      commandProps.ExpressionAttributeValues = {
        ...commandProps.ExpressionAttributeValues,
        ...filterExpressionRaw.expressionAttributeValues,
        ':classType': this.classType
      };
    }

    if (lastEvaluatedKey) {
      commandProps.ExclusiveStartKey = lastEvaluatedKey;
    }
    if (limit) {
      commandProps.Limit = limit;
    }
    console.log('QueryCommand', commandProps);
    const command = new QueryCommand(commandProps);
    let result = [];
    const queryResult = await this.dynamoDBClient.send(command);
    if (queryResult.Items) {
      result = queryResult.Items;
    }
    lastEvaluatedKey = queryResult.LastEvaluatedKey;
    while (!!lastEvaluatedKey) {
      commandProps.ExclusiveStartKey = lastEvaluatedKey;
      const command = new QueryCommand(commandProps);
      const queryResult = await this.dynamoDBClient.send(command);
      if (queryResult.Items) {
        result.push(...queryResult.Items);
      }
      lastEvaluatedKey = queryResult.LastEvaluatedKey;
      if (limit && result.length >= limit) {
        break;
      }
    }
    return limit && limit > result.length ? result.slice(0, args.limit) : result;
  }

  async delete(partitionKeyValue, sortKeyValue = null) {
    const key = {
      [this.partitionKey]: partitionKeyValue
    };
    if (this.sortKey && sortKeyValue !== undefined && sortKeyValue !== null) {
      key[this.sortKey] = sortKeyValue;
    }
    const commandProps = {
      TableName: this.tableName,
      Key: key
    };
    const command = new DeleteCommand(commandProps);
    await this.dynamoDBClient.send(command);
  }
}

export const dynamoDBClient = DynamoDBDocument.from(
  new DynamoDB({
    credentials: {
      accessKeyId: process.env.BE_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.BE_AWS_SECRET_ACCESS_KEY
    },
    region: process.env.BE_AWS_DEFAULT_REGION,
    maxAttempts: 3,
    retryMode: 'standard'
  }),
  {
    marshallOptions: {
      convertEmptyValues: true,
      removeUndefinedValues: true,
      convertClassInstanceToMap: true
    }
  }
);

export const userDao = new Dao(dynamoDBClient, 'User', 'FastStorage', 'pk', 'sk');
export const productDao = new Dao(dynamoDBClient, 'Product', 'FastStorage', 'pk', 'sk');
export const productLinkDao = new Dao(dynamoDBClient, 'ProductLink', 'FastStorage', 'pk', 'sk');
export const productVersionDao = new Dao(dynamoDBClient, 'ProductVersion', 'FastStorage', 'pk', 'sk');
export const USER_GSI = 'userId-classType-index';
