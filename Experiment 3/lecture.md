# OOPS FUNDAMENTALS

1. CLASSES AND OBJECTS
2. INHERITENCE
3. POLYMORPHISM
4. ABSTRACTION
5. ENCAPSULATION

#### CAN WE HAVE A PRIVATE CONSTRUCTOR - yes! but that class can create its object only in itself.


# INHERITENCE (IS A RELATIONSHIP)
- ISSUES:
```RUBY
- TIGHT COUPLING
- DATA OVERLOADING (EXCESS DATA)
```

# ASSOCIATION (HAS A RELATIONSHIP)
- COUPLING IS LOOSE
- CLASSES ARE INDEPENDENT

    - AGGREGATION: Weak Bonding
    ```JAVA
    class MusicPlayer {
         
    }

    class Car {
        MusicPlayer mp;
    }
    ```

    - COMPOSITION: STRONG BONDING
    ```JAVA
    class Hotel {

    }

    class Room {

    }

    // Room cannot exists without Hotel
    ```

# DEPENDENCY (USES A RELATIONSHIP)
- When a method of a class is used by other class.

---
## ENUMS (need to Study)
- A Class In Which I can declare constructors, variables, constructors, methods.
- We can't create object types but rather can create reference

### Why we need it ?
1. By Default Variable Types: 
```java
public static final
```
2. They Give Type Safety
3. E.G:
```java
enum Status {
    ACTIVE,
    INACTIVE,
    BLOCKED
}
Status userStatus = Status.ACTIVE;
```