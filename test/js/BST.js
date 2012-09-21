/*jslint sloppy: true*/
var gnosys = require('../../index'),
    BST = gnosys.datastructures.BST,
    t1 = new BST(),
    t2 = new BST();

t1.insert(3);
t1.insert(9);
t1.insert(3);
t1.insert(6);
t1.insert(1);
t1.insert(0);
t1.insert(2);
t1.insert(4);
t1.insert(9);
t1.insert(7);
t1.insert(5);
t1.insert(5);
t1.insert(1);
t1.insert(1);
t1.insert(2);
t1.insert(3);
t1.insert(2);
t1.insert(1);
t1.insert(1);
t1.insert(2);

t2.insert(9);
t2.insert(8);
t2.insert(7);
t2.insert(6);
t2.insert(5);
t2.insert(4);
t2.insert(3);
t2.insert(2);
t2.insert(1);

console.log(t1.gridPrint());
console.log(t1.keysToString());

exports['BST inorder yields shorted key sequence'] = function (test) {
    test.equal(t1.keysToString(), "0,1,1,1,1,1,2,2,2,2,3,3,3,4,5,5,6,7,9,9");
    //test.equal(t2.keysToString(), "1,2,3,4,5,6,7,8,9");
    test.equal(t2.keysToString(), "1,2,3,4,5,6,7,8,9");
    test.done();
};
