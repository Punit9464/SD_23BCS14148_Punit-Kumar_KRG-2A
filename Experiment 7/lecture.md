# MASTER - SLAVE : READ HEAVY
    - VOTING, LEADER-FOLLOWER MODEL

# MASTER - MASTER : WRITE HEAVY
    - EVERY MASTER IS RESPONSIBLE FOR READ AS WELL AS WRITE


## SHARDING VS PARTITIONING
- PARTITIONING - STAYS ON SAME MACHINE AFTER DATA IS SEGMENTED

- SHARDING - DATA IS DIVIDED INTO SEGMENTS BUT DIVIDED ON DIFFERENT MACHINES

# SHARDING
### Techniques for sharding
- Range - Based Sharding
- Hash - Based Sharding
- Directory - Based Sharding

#### Range Based
- Data is Divided on ranges
```
e.g 
A - M => Shard 1
N - P => Shard 2
Q - Z => Shard 3
```
- leads to Hotspot problem

#### Hash Based
- Uses a hash function
- Problem -> If Static Hashing => User Data needs to be shifted from shard to other shards

- Consistent Hashing

#### Directory Based
- maintain a look up table (user_id, shard_id) => TLB for Shard finding

## INDEXING
- IMPROVE SEARCHING
- SYNTAX:
```sql
CREATE INDEX IX_NAME TABLE_NAME(COL_NAME);
```

1. Clustered Index => 
    - It is same as your primary keys
    - Preserves the physical order of the table (faster searching)
    - Only one clustered index per one table

2. Non - Clustered Index =>
```sql
CREATE NON CLUSTERED INDEX EMPLOYEE(SALARY);
```

=> After Creating Index 
Query -> Index Table / Virtual Table -> Main Table (Row Address)

## TRANSACTIONS
- SET OF INSTRUCTIONS

### DIRTY READ / PHANTOM READ
1. LOCKING - 
    - 2PL (2 PHASE LOCKING)
    similarly 2 PHASE COMMIT -> prepare phase, commit phase

2. SAGA Pattern