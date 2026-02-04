# SOLID PRINCIPLES
- S - Single Responsibility Principle
- O - Open/Closed Priniciple
- L - Liskov Substuition Priniciple
- I - Interface Segregation Priniciple
- D - Dependency Inversion Principle

## Single Responsibility Principle 
- A class should have a single reason to change

## Open Closed Priniciple
- Open for extension and Closed for modification
- We should not change the preexisting code much and code must be open for extension

## Liskov Substitution Priniciple
- A Dervied class must be substitutable with its parent class. The logic must not be broken if its done.
- Can i replace class B with A ?

## Interface Segregation Principle
- Interfaces must be segregated, no responsibility should be forced.
- It attacks fat abstractions.

- e.g, Printer should not care about fax so Printer should not have feature of Fax, a Fax interface must be segregated.


## Dependency Inversion Principle
- High Level modules should not depend upon low level modules.
- Both should be dependent on abstractions.


# STANDARD CODE TEMPLATES
1. CREATIONAL DP: WE TALK ABOUT CREATION OF OBJECTS EFFICIENTLY
    - SINGLETON DESIGN PATTERN (only a single object to be instantiated during the whole project. For example, one database connector instance)
    - FACTORY DESIGN PATTERN (ASBTRACTION OF THE OBJECT TO RETURN WHICH OBJECT TO BE USED)
    - ABSTRACT FACTORY DESIGN PATTERN (FAMILY OF OBJECTS)
    - BUILDER DESIGN PATTERN
2. STRUCTURAL DP: WE DEFINE THE STRUCTURE OF CLASSES AND OBJECTS
    - ADAPTER DESIGN PATTERN
    - DECORATOR DESIGN PATTERN OR ONION DP
    - FACADE DESIGN PATTERN or (Abstraction of the Core Logic)
    - PROXY DESIGN PATTERN (Dont Create the Object Until it is not needed)
3. BEHAVIORAL DP: MAKE COMMUNICATIONS BETWEEN OBJECTS
    - OBSERVER DESIGN PATTERN
    - STRATEGY DESIGN PATTERN


```JAVA
STUDY: VOLATILE KEYWORD USAGE IN JAVA
```
## BUILDER Design Pattern
- Object is built gradually as per the user input
- Rather than doing this:
```java
// Rather than doing this
House(rooms, floors, hasGarage, hasPool, paintColor, flooring, ...)

// We Prefer this:
HouseBuilder()
  .addRooms(3)
  .addGarage()
  .addPool()
  .setPaint("White")
  .build();
```

## ADAPTER Design Pattern
- We create adapters to fit into the abstracts

```java
class AudioPlayer {
    public static void main(String[] args) {
        MediaPlayer player =
            new MediaAdapter(new VLCPlayer());
        player.play("song.vlc");
    }
}
```
