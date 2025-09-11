# API Contracts: Skins Account Management

## Authentication

All endpoints require authentication and current member status verification.

- Header: `Authorization: Bearer {token}`
- User must be an active club member
- Users can only access their own data

## Base URL

**Development**: `http://localhost:8000/api/accounts/`  
**Production**: `https://data.bhmc.org/api/accounts/`

**Available Endpoints:**

- Skins account data: `/skins/`
- Transaction history: `/skin-transactions/`
- User preferences: `/skin-settings/`

---

## GET /skins/

Get account balance and settings for the current user.

### Request

```http
GET /api/accounts/skins/
Authorization: Bearer {token}
```

### Response 200

```json
{
  "account": {
    "id": 456,
    "userId": 123,
    "currentBalance": 12500,
    "payoutFrequency": "monthly",
    "lastPayoutDate": "2025-09-01T00:00:00Z",
    "createdAt": "2025-01-15T10:30:00Z",
    "updatedAt": "2025-09-01T00:00:00Z"
  },
  "seasons": [
    {
      "year": 2025,
      "startDate": "2024-11-01T00:00:00Z",
      "endDate": "2025-10-31T23:59:59Z",
      "isActive": true
    },
    {
      "year": 2024,
      "startDate": "2023-11-01T00:00:00Z",
      "endDate": "2024-10-31T23:59:59Z",
      "isActive": false
    }
  ],
  "currentSeason": 2025
}
```

### Error Responses

- `401`: Unauthorized - Invalid or missing token
- `403`: Forbidden - Not authorized to access this account
- `404`: Not Found - User or account not found

---

## GET /skins/ (with season filter)

Get skins winnings for the current user and season.

### Request

```http
GET /api/accounts/skins/?season=2025
Authorization: Bearer {token}
```

### Query Parameters

- `season` (optional): Season year for filtering
- `limit` (optional): Max results (default: 100)
- `offset` (optional): Pagination offset (default: 0)

### Response 200

```json
{
  "winnings": [
    {
      "id": 789,
      "userId": 123,
      "eventId": 456,
      "eventName": "Saturday Skins - Hole 7",
      "eventDate": "2025-08-15T14:30:00Z",
      "holeNumber": 7,
      "amount": 2500,
      "season": 2025,
      "createdAt": "2025-08-15T18:00:00Z"
    }
  ],
  "totalAmount": 12500,
  "season": 2025,
  "count": 5
}
```

### Error Responses

- `401`: Unauthorized
- `403`: Forbidden - Not authorized to access this user's data
- `400`: Bad Request - Invalid parameters

---

## GET /skin-transactions/

Get transaction history for the current user and season.

### Request

```http
GET /api/accounts/skin-transactions/?season=2025
Authorization: Bearer {token}
```

### Query Parameters

- `season` (optional): Season year for filtering
- `season` (required): Season year
- `type` (optional): Filter by transaction type
- `limit` (optional): Max results (default: 100)
- `offset` (optional): Pagination offset (default: 0)

### Response 200

```json
{
  "transactions": [
    {
      "id": 101,
      "userId": 123,
      "type": "win",
      "amount": 2500,
      "description": "Skins win - Hole 7",
      "eventId": 456,
      "season": 2025,
      "processedAt": "2025-08-15T18:00:00Z",
      "createdAt": "2025-08-15T18:00:00Z"
    },
    {
      "id": 102,
      "userId": 123,
      "type": "payout",
      "amount": -10000,
      "description": "Monthly payout",
      "season": 2025,
      "processedAt": "2025-09-01T10:00:00Z",
      "createdAt": "2025-09-01T10:00:00Z"
    }
  ],
  "season": 2025,
  "summary": {
    "totalWins": 12500,
    "totalPayouts": -10000,
    "totalAdjustments": 0,
    "netAmount": 2500
  }
}
```

### Error Responses

- `401`: Unauthorized
- `403`: Forbidden
- `400`: Bad Request - Invalid parameters

---

## PATCH /skin-settings/

Update payout preferences for the current user's account.

### Request

```http
PATCH /api/accounts/skin-settings/
Authorization: Bearer {token}
Content-Type: application/json

{
  "payoutFrequency": "bi-monthly"
}
```

### Request Body

```json
{
  "payoutFrequency": "bi-monthly" | "monthly" | "yearly"
}
```

### Response 200

```json
{
  "account": {
    "id": 456,
    "userId": 123,
    "currentBalance": 12500,
    "payoutFrequency": "bi-monthly",
    "lastPayoutDate": "2025-09-01T00:00:00Z",
    "createdAt": "2025-01-15T10:30:00Z",
    "updatedAt": "2025-09-10T15:45:00Z"
  },
  "success": true,
  "message": "Payout preferences updated successfully"
}
```

### Error Responses

- `401`: Unauthorized
- `403`: Forbidden
- `400`: Bad Request - Invalid payout frequency
- `422`: Unprocessable Entity - Validation errors

---

## Error Response Format

All error responses follow this format:

```json
{
  "errors": [
    {
      "message": "Invalid payout frequency",
      "field": "payoutFrequency",
      "code": "INVALID_VALUE"
    }
  ],
  "statusCode": 400
}
```

## Rate Limiting

- Limit: 100 requests per minute per user
- Header: `X-RateLimit-Remaining: 95`
- Status: `429 Too Many Requests` when exceeded

## Caching Headers

- `Cache-Control: private, max-age=60` for account data
- `Cache-Control: private, max-age=300` for historical data
- `ETag` headers for conditional requests
