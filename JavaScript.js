﻿var INPUT = document.getElementById("INP");
var OUTPUT = document.getElementById("OUT")
var INVENTORY = document.getElementById("INV")
var allInInv = [];

var validCommands = [

    ["use", ["use", "combine"], 2, "use(x[1], x[2]);", "use {object1} {object2}"],
    // open = [ALLOWED PHRASE], AMOUNT OF PARAMETERS
    ["open", ["open", "look inside",], 1, "open(x[1]);", "open {container}"],
    ["close", ["close", "shut"], 1, "close(x[1]);", "close {container}"],
    // take [ALLOWED PHRASE], AMOUNT OF PARAMETERSS
    ["take", ["take", "grab", "get"], 2, "take(x[1], x[3])", "take {object} {container}"],
    ["examine", ["look"], 1, "examine(x[1]);", "examine {anything}"],
    ["clear", [null], 0, "clearOut();", "clear"],
    ["go",["move", "travel"], 1, "go(x[1]);", "go {direction}"],
    ["help", ["help", "commands"], 0, "updateOut(help());", "help"]

];

var allRooms = [];
var allObjects = [];
var allContainers = [];
var allInputs = ["use teabag teacup",  "take sugar cupboard","open cupboard"];
var inputOn = -1;

INPUT.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        INPUT.value.toLowerCase();
        allInputs.push(INPUT.value);
        inputOn = -1;
        doCommand(INPUT.value);
        INPUT.value = "";
    };

    if (event.keyCode === 38) {
        if (inputOn < allInputs.length-1) {
            inputOn++;
            INPUT.value = allInputs[allInputs.length - inputOn-1];

        }
    }

    if (event.keyCode === 40) {
        if (inputOn <= allInputs.length-1 && inputOn > -1) {
            inputOn--;
            if (inputOn == -1) { INPUT.value = ""; } else {
                INPUT.value = allInputs[allInputs.length - 1 - inputOn];
            }
        }
    }

});

function doCommand(x) {

    x.toLowerCase();
    x = x.split(" ");

    for (var i = 0; i < validCommands.length; i++) {
        if (x[0] == validCommands[i][0]) {
            if (x.length != validCommands[i][2] + 1) {
                updateOut("Incorrect usage! Try: " + validCommands[i][4]);
            } else {
                eval(validCommands[i][3]);
                console.log("Command!")
            }
        } else { // if it isnt the first command, check the other available commands
            for (var j = 0; j < validCommands[i][1].length; j++) {
                if (x[0] == validCommands[i][1][j]) { // if x is another available command,
                    eval(validCommands[i][3]); // run the code
                }
            }
        }
    }
}

function updateOut(string) {

    checkInv();
    OUTPUT.innerHTML = OUTPUT.innerHTML + "</br>" + "> " + string; + "</br></br></br>";
    OUTPUT.scrollTop = OUTPUT.scrollHeight;

}

function clearOut() {
    OUTPUT.innerHTML = "";
}

function help() {
    var output = "";
    for (var i = 0; i < validCommands.length; i++) {
        output = output + "Command: " + validCommands[i][0] + " | Usage: " + validCommands[i][4] + "</br>";
    }
    return (output);
}

function examine(x) {
    x = x.toLowerCase()

    for (var i = 0; i < allObjects.length; i++) {
        if (x == allObjects[i].objectID || x == allObjects[i].objectName.toLowerCase()) {
            if (allObjects[i].isInInventory == true) { updateOut(allObjects[i].description); } else { updateOut("You don't have this item!") }
        } 
    }

    for (var i = 0; i < allRooms.length; i++) {
        if (x == allRooms[i].roomID && allRooms[i].isPlayer == true) {
            updateOut(allRooms[i].description);
        } 

        for (var k = 0; k < allRooms[i].storage.length; k++) {

            if (x == allRooms[i].storage[k].storageID.toLowerCase() || x == allRooms[i].storage[k].storageName.toLowerCase()) {
                console.log(allRooms[i].storage[k])
                var toSend = allRooms[i].storage[k].description + " It contains: ";
                for (var o = 0; o < allRooms[i].storage[k].contains.length; o++) {
                    toSend = toSend + allRooms[i].storage[k].contains[o].objectName + ", ";
                }
                
                updateOut(toSend);
            }
        }
    }
    
}

function go(x) {
    console.log(allRooms.length)

}


function checkInv() {
    var toOut = "";

    var p = false;

    for (var j = 0; j < allInInv.length; j++) {

        for (var i = 0; i < allObjects.length; i++) {
        
            if (allObjects[i].isInInventory == false && allObjects[i].objectID == allInInv[j].objectID) {
                allInInv.splice(j, 1);
            }
        }
        toOut = toOut + allInInv[j].objectName + ", ";
    }
    INVENTORY.innerHTML = "Inventory: " + "</br>" + "<font id='clue'>" + toOut + "</font>";
};

function addToInv(x) {
    allInInv.push(x);
}


function open(containerID) {
    containerID = containerID.toLowerCase();
    for (var i = 0; i < allContainers.length; i++) {

        if (containerID == allContainers[i].storageID.toLowerCase() || containerID == allContainers[i].storageName.toLowerCase()) {

            if (allContainers[i].isOpen == true) {
                updateOut("This container is already open!");
            } else if (allContainers[i].isLocked == true) {
                updateOut("This container is Locked! Use a key on it!");
            } else {
                allContainers[i].isOpen = true;
                var toSend = "You open the " + allContainers[i].storageName + ".";
                updateOut(toSend);
            }
        }
    }
};

function close(containerID) {
    containerID = containerID.toLowerCase();
    for (var i = 0; i < allContainers.length; i++) {
        if (containerID == allContainers[i].storageID.toLowerCase() || containerID == allContainers[i].storageName.toLowerCase()) {
            if (allContainers[i].isOpen == false) {
                updateOut("This container is already closed!");
            } else {
                allContainers[i].isOpen = false;
                var toSend = "You close the " + allContainers[i].storageName + ".";
                updateOut(toSend);
            }
        }
    }
};

function take(object, container) {

    for (var i = 0; i < allRooms.length; i++) {
        if (allRooms[i].isPlayer == true) {
            console.log(allRooms[i])
            for (var j = 0; j < allRooms[i].storage.length; j++) {
                if (allRooms[i].storage.contains != null) {
                    console.log("here")
                    for (var k = 0; k < allRooms[i].storage[j].contains.length; k++) {
                        if (allRooms[i].storage[j].isOpen == true && (allRooms[i].storage[j].storageID == container || allRooms[i].storage[j].storageName == container) && allRooms[i].storage.contains[k] == object) {
                            allRooms[i].storage[j].contains[k] == true;
                            console.log("here");
                            var toSend = "You take the " + object;
                            updateOut(toSend);
                        }
                    }
                }
                
            }

        }
    }

};

function use(objectID1, objectID2) {

    checkInv();
    objectID1 = objectID1.toLowerCase();
    objectID2 = objectID2.toLowerCase();

    for (var i = 0; i < allInInv.length; i++) {

        if (allInInv[i].objectID.toLowerCase() == objectID1 || allInInv[i].objectName.toLowerCase() == objectID1) {
            // if the first item is in the inventory, check the 2nd item
            var object1 = allInInv[i];
            for (var j = 0; j < allInInv.length; j++) {
                if ((allInInv[j].objectID.toLowerCase() == objectID2 || allInInv[j].objectName.toLowerCase() == objectID2)) {
                    var object2 = allInInv[j];
                    // if the 2nd item is in the inventory,
                    for (var k = 0; k < object1.Commands.use.length; k++) {
                        // check through the objects commands to see if the 2nd object is valid
                        //console.log(object1.Commands.use[k], k)
                        //console.log("test", object1.Commands.use[k], objectID2)
                        if (object1.Commands.use[k].objectID.toLowerCase() == objectID2 || object1.Commands.use[k].objectName.toLowerCase() == objectID2) {
                            return (allInInv[i].Commands.useCode());
                        } 
                    }
                };
            };
        };
    };
    updateOut("You don't have the required items, or this isn't a correct combination.");
};

function fixObjects() {
    // for all objects
    for (var i = 0; i < allObjects.length; i++) {
        for (var k = 0; k < allObjects.length; k++) {

            if (allObjects[i].Commands.use[0] != null && typeof allObjects[i].Commands.use[0] != "object" ) {
                var usage = allObjects[i].Commands.use;
                for (var j = 0; j < usage.length; j++) {
                    usage[j] = usage[j].toLowerCase();
                    if (usage[j] == allObjects[k].objectID) {
                        allObjects[i].Commands.use[j] = allObjects[k];
                    }
                }
            }
        }
        

        if (allObjects[i].isInContainer[0] == true) {
            for (var j = 0; j < allContainers.length; j++) {
                if (allContainers[j].storageID == allObjects[i].isInContainer[1]) {
                    allContainers[j].contains.push(allObjects[i]);
                }
            }
        }
    }
    
}

class Storage {
    // storage = storageID, storageName, description, open, locked, [itemIDs]
    constructor(storageID, storageName, description, isOpen, isLocked, contains) {
        //console.log('hi')
        this.Name = storageName;
        this.storageID = storageID;
        this.storageName = storageName;
        this.description = description;
        this.isOpen = isOpen;
        this.isLocked = isLocked;
        this.contains = [];

        if (contains != null) {
            for (var i = 0; i < contains.length; i++) {
                this.contains.push(contains[i]);
            }
        }

        allContainers.push(this);

    }

}

class Object {

    constructor(objectID, objectName, description, inInventory, containerID, okCommands, roomID) {
        //this.Name = objectID;
        this.objectID = objectID.toLowerCase();
        this.objectName = objectName;
        this.description = description;
        this.isInInventory = inInventory;
        if (this.isInInventory == true) {
            allInInv.push(this);
        }

        if (containerID != null) {
            this.isInContainer = [true, containerID];
        } else {
            this.isInContainer = [false, roomID];
        }

        this.Commands(okCommands);
        allObjects.push(this);
    };


    // array special, bool take & drop, array use {ok objects}, array open,
    Commands = function (okCommands) {
        this.Commands.special = okCommands[0];
        this.Commands.take = okCommands[1];
        this.Commands.use = okCommands[2];
        this.Commands.open = okCommands[3];
        
        if (this.Commands.use[0] != null) {
            var code = this.Commands.use[0][1];
            this.Commands.useCode = function () {
                eval(code);
            };

            this.Commands.use[0] = this.Commands.use[0][0];
        }
    }

};

class Room {

    constructor(roomID, description, isPlayer, connectedRooms, _objects, _storage) {
        this.roomID = roomID;
        this.description = description;
        this.isPlayer = isPlayer;
        this.connectedRooms = connectedRooms;

        this.Objects(_objects, roomID);
        this.objects = allObjects;

        this.storage = [];

        for (var i = 0; i < _storage.length; i++) {
            this.storage.push(_storage[i][0] = new Storage(_storage[i][0], _storage[i][1], _storage[i][2], _storage[i][3], _storage[i][4], _storage[i][5]));
        }
        allRooms.push(this);
    };

    Objects = function(objects, roomID) {
        for (var i = 0; i < objects.length; i++) {
            window[objects[i][0]] = new Object(objects[i][0], objects[i][1], objects[i][2], objects[i][3], objects[i][4], objects[i][5], roomID);
        };
    };

};
 

// room = str roomID, str description, bool isPlayerInside, array connectedRooms, array objects, array storage
var room1 = new Room(
    "room1",
    `
You awaken in a <font id="clue">room</font>.
</br></br>
The Eastern side of the room resembles a Kitchen. 
</br></br>
A counter spreads the height of the room;
it has 2 faucets inset, as well as a <font id="clue">cupboard</font>. A <font <font id="clue">Tea Cup</font> is on the countertop.
</br></br>
There is a <font id="clue">Door</font> to the <font id="clue">North</font>.
   `,    
    true,
    [["room2", "North"]]
    ,

    // objects = str objectID, str objectName, str description,  bool isInInventory, str containerID, array okCommands,
    [
        ["Teabag1", "Teabag", "This is a bag of tea.", false, "Cupboard1",
            // array special, bool take & drop, array use {ok objects}, array open,
            // [[special], take, [use objects], [opens doors]]
            [
                [null],
                true,
                [["Teacup1", "Teabag1.isInInventory = false; Teacup1.Commands.special[1] = true; updateOut('You place the teabag in the teacup.')"]],
                [null]
            ]
        ],

        ["Sugar1", "Sugar", "There is some sugar inside a pouch.", false, "Cupboard1",
            [
                [null],
                true,
                [["Teacup1", "Sugar1.isInInventory = false; Teacup1.Commands.special[3] = true; updateOut('You pour some sugar into the teacup.')"]],
                [null]
            ]
        ],

        ["Teacup1", "Teacup", "This is a tea cup.", false, null,
            // has milk , has teabag, has water, has sugar
            [
                [false, false, false, false],
                false,
                [null],
                [null]
            ]
        ],

        ["Masterkey1", "Master Key", "This is a key to open all doors.", true, null,
            [
                [null],
                true,
                [null],
                ["all"]
            ]
        ]
    ],

    // storage = storageID, storageName, description, open, locked, [itemIDs]
    [
        ["Cupboard1", "Cupboard", "This cupboard is built into the kitchen counter.", true, false, []],
        ["Chest1", "Chest", "A sturdy chest is in the South West corner of the room.", false, true, []],
        ["Faucet1", "Faucet", "A faucet is built into the kitchen counter.", false, false, []]
    ]
);

var room2 = new Room(

    "room2",
    "Inside this room are 3 pedestals, an Eastern Pedestal, a Central Pedestal, and a Western Pedestal.",
    false,
    [["room1", "South"]]
    ,

    // objects = str objectID, str objectName, str description,  bool inInventory, str containerID, array okCommands,
    [
        ["Ring1", "Smallest Ring", "This room is the smallest of the Four Rings.", false, "Pedestal1",
            [// [[special], take, [use objects], [opens doors]]
                [null],
                false,
                [null],
                [null]
            ]
        ],
        ["Ring2", "Smallest Ring", "This room is the smallest of the Four Rings.", false, "Pedestal1",
            [// [[special], take, [use objects], [opens doors]]
                [null],
                false,
                [null],
                [null]
            ]
        ],
        ["Ring3", "Smallest Ring", "This room is the smallest of the Four Rings.", false, "Pedestal1",
            [// [[special], take, [use objects], [opens doors]]
                [null],
                false,
                [null],
                [null]
            ]
        ],
        ["Ring4", "Largest Ring", "This ring is the largest of the Four Rings.", false, "Pedestal1",
            [// [[special], take, [use objects], [opens doors]]
                [null],
                false,
                [null],
                [null]
            ]
        ]
    ],

    // storage = storageID, storageName, open, locked, [itemIDs]
    [
        ["Pedestal1", "Eastern Pedestal", true, false, []],
        ["Pedestal2", "Central Pedestal", true, false, []]
    ]

);

checkInv();
fixObjects();