var SelectSentence = (function(document) {
'use strict';

/**
 * On key pressed, it will create (if valid) a new word group
 *
 * @param {Event}   pressEvent
 * @param {Window}  localWindow
 * @param {Element} sentence, div containing the sentence
 * @param {Element} groupList,
 */
var addWordGroup = function(
    pressEvent,
    localWindow,
    sentence,
    groupList
) {

    if (!isValidKey(pressEvent)) {
        return;
    }
    var selection = localWindow.getSelection();
    if (isValidSelection(selection)) {
        console.warn("start and end not on same node");
        return;
    }
    var group = getGroupFromKey(pressEvent);


    // TODO we handle only one range for the time being
    var range = selection.getRangeAt(0);

    // prevent user from creating a group inside the same group
    // regardless how nested, as it would make no sense
    if (insideSameGroup(sentence, group, range)) {
        return;
    }

    createWordsGroupFromRange(group, range);
    sentence.normalize();

    addGroupToList(group, groupList, sentence);
};

/**
 * @param {Element} sentence
 * @param {Element} groupList
 */
var generateGroupListItems = function(sentence, groupList) {
    var groups = Array.from(sentence.querySelectorAll("[data-group]"));

    var groupNames = groups.map(function(g) { return g.dataset.group; });
    groupNames.forEach(function(name) {
        addGroupToList(name, groupList, sentence);
    });
};

/**
 * Check whether the range is already inside said group
 * of given sentence
 *
 * @param {Element} sentence
 * @param {string}  group
 * @param {Range}   range
 *
 * @return {bool}
 */
var insideSameGroup = function(sentence, group, range) {
    var sentenceGroups = getGroupsFromElement(sentence, group);
    for (var i = 0; i <  sentenceGroups.length; i++) {
        if (
            sentenceGroups[i].contains(range.endContainer) ||
            sentenceGroups[i].contains(range.startContainer)
        ) {
            return true;
        }
    }
    return false;
};

/**
 *
 * @param {string} group
 * @param {Range}  range
 *
 * @param {Element}
 */
var createWordsGroupFromRange = function(
    group,
    range
) {
    var span = document.createElement("span");
    // TODO certainly firefox only?
    span.setAttribute("data-group", group);

    range.surroundContents(span);

    return span;
};

/**
 * @param {string}
 * @param {Element}
 * @param {Element}
 */
var addGroupToList = function(group, groupList, sentence) {

    var wordGroups = getGroupsFromElement(groupList,group);
    // we're not supposed to have more than once the same group
    if (wordGroups.length > 1) {
        throw new Exception("too many group");
    }

    var li = wordGroups[0];
    // if this group already exists in the list, it's fine
    // we don't need to do anything
    if (li !== undefined) {
        return;
    }

    // otherwise we create said group, with associated event
    li = document.createElement("li");

    var remove = document.createElement("button");
    remove.appendChild(document.createTextNode("remove"));
    // TODO certainly firefox only?
    li.appendChild(remove);
    li.setAttribute("data-group", group);
    remove.onclick = removeWordGroup.bind(
        remove,
        li,
        sentence,
        group
    );

    // mouse over -> underline the words in that group
    li.onmouseover = function() {
        var sentenceGroups = getGroupsFromElement(sentence, group);
        for (var i = 0; i <  sentenceGroups.length; i++) {
            sentenceGroups[i].style.textDecoration = "underline";
        }
    };

    // mouse out -> remove underline on the words in that group
    li.onmouseout = function() {
        var sentenceGroups = getGroupsFromElement(sentence, group);
        for (var i = 0; i <  sentenceGroups.length; i++) {
            sentenceGroups[i].style.textDecoration = "";
        }
    };

    groupList.appendChild(li);

};

/**
 * remove a group of words from the sentence and the list of group
 * (only the group, not the content itself)
 *
 * @param {Element} li
 * @param {Element} sentence
 * @param {string}  group
 *
 * @private
 */
var removeWordGroup = function(li, sentence, group) {
    var sentenceGroups = getGroupsFromElement(sentence, group);
    for (var i = 0; i <  sentenceGroups.length; i++) {
        sentenceGroups[i].outerHTML = sentenceGroups[i].innerHTML;
    }
    // normalize permit to automatically merge adjacent text nodes etc.
    sentence.normalize();

    li.remove();
};

/**
 * Check if said selection can be used to deliminate a group of words
 *
 * @param {Selection}
 *
 * @return bool
 */
var isValidSelection = function(selection) {
    return (
        selection.anchorNode !== selection.focusNode &&
        // TODO to keep things simple, we disallow multiple range
        // in one selection (one can do that by keeping ctrl pressed)
        selection.rangeCount !== 1
    );
};

/**
 * Check if the key pressed is one that can be used to identify a word group
 *
 * @param {Event}
 * @return {bool}
 */
var isValidKey = function(keyEvent) {
    // if on digits line of a qwerty keyboard
    var keyCode = keyEvent.keyCode;
    return keyCode >= 48 && keyCode <= 57;

};

/**
 * Return the group of words associated to the key pressed
 *
 * @param  {Event}   keyEvent
 * @return {string}
 * @private
 */
var getGroupFromKey = function(keyEvent) {

    var keycode = keyEvent.keyCode;
    return {
        48 : "0",
        49 : "1",
        50 : "2",
        51 : "3",
        52 : "4",
        53 : "5",
        54 : "6",
        55 : "7",
        56 : "8",
        57 : "9",
    }[keycode];

};

/**
 * @param {Element}
 * @param {string}
 *
 * @return {NodeList}
 */
var getGroupsFromElement = function (element, group) {

    return element.querySelectorAll("[data-group='"+group+"']");
};


return {
    addWordGroup : addWordGroup,
    generateGroupListItems: generateGroupListItems
};

}(document));
