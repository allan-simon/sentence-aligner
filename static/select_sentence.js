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

    addGroupToList(group, groupList, sentence);
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
    var sentenceGroups = sentence.getElementsByClassName(group);
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
    span.classList.add(group);

    range.surroundContents(span);

    return span;
};

/**
 * @param {string}
 * @param {Element}
 * @param {Element}
 */
var addGroupToList = function(group, groupList, sentence) {


    // we're not supposed to have more than once the same group
    if (groupList.getElementsByClassName(group).length > 1) {
        throw new Exception("too many group");
    }

    var li = groupList.getElementsByClassName(group)[0];
    // if this group already exists in the list, it's fine // we don't need to do anything var li = groupList.getElementsByClassName(group)[0];
    if (li !== undefined) {
        return;
    }

    // otherwise we create said group, with associated event
    li = document.createElement("li");
    // TODO certainly firefox only?
    li.classList.add(group);
    li.onclick = removeWordGroup.bind(
        li,
        sentence,
        group
    );

    // mouse over -> underline the words in that group
    li.onmouseover = function() {
        var sentenceGroups = sentence.getElementsByClassName(group);
        for (var i = 0; i <  sentenceGroups.length; i++) {
            sentenceGroups[i].style.textDecoration = "underline";
        }
    };

    // mouse out -> remove underline on the words in that group
    li.onmouseout = function() {
        var sentenceGroups = sentence.getElementsByClassName(group);
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
 * this method is associated to a <li>
 *
 * @param {Element} sentence
 * @param {string}  group
 *
 * @private
 */
var removeWordGroup = function(sentence, group) {
    var sentenceGroups = sentence.getElementsByClassName(group);
    for (var i = 0; i <  sentenceGroups.length; i++) {
        sentenceGroups[i].outerHTML = sentenceGroups[i].innerHTML;
    }
    // normalize permit to automatically merge adjacent text nodes etc.
    sentence.normalize();

    this.remove();
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
    return "group-" + {
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


return {
    addWordGroup : addWordGroup
};

}(document));