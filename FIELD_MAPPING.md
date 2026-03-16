# Frontend Field Mapping

The database uses all lowercase column names. Update all frontend files:

## Database Column Names (lowercase):
- shopnumber
- tenantname
- shopid
- othercharges
- billid
- paidamount
- dueamount
- paymentdate

## Frontend needs to read these lowercase names from API responses.

All `.jsx` files in `client/src/pages/` need updates to use lowercase when reading from API.
