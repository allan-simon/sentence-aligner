var Structure = (function () {
'use strict';

/**
 * @param {Event}   keyEvent
 * @param {Element} sentenceDiv
 * @param {Element} groupList
 *
 * @public
 */
var addButton = function(keyEvent, sentenceDiv, groupList) {

    var group = getGroupFromKey(keyEvent);
    if (group === undefined) {
        return;
    }
    var wordGroups = getGroupsFromElement(groupList, group);
    if (wordGroups.length !== 1) {
        return;
    }
    var li = wordGroups[0];

    if (li.getElementsByClassName("add-meta").length > 0) {
        return;
    }

    var addMeta = document.createElement("button");
    addMeta.classList.add("add-meta");
    addMeta.appendChild(document.createTextNode("add meta"));
    addMeta.onclick = addMetaInput.bind(
        addMeta,
        group,
        sentenceDiv,
        li
    );

    li.appendChild(addMeta);
};

/**
 * @param {String} id
 * @param {Element} structure
 *
 * @public
 */
var save = function (id, structureDiv) {
    var xmlStructure = Converter.createXMLFromHTML(
        structureDiv,
        document.createElement("structure")
    );
    var formData = {
       structure: xmlStructure.outerHTML 
    };
    return Async.put('/sentences/'+id+"/structure", formData)
        .then(function(x) {
            console.log(x);
        })
        .catch(function() {console.error("error");})
    ;
};

/**
 * @param {Element} sentenceDiv
 * @param {Element} groupList
 */
var generateMetaList = function(sentenceDiv, groupList) {

    var items = Array.from(groupList.querySelectorAll("[data-group]"));
    items.forEach(
        function(item) {
            /** @type {String} */
            var group = item.dataset.group;
            // TODO we consider that all blocks belonging to the same group
            // should have the same meta key/value, so we only treat the first
            // one
            var wordGroup = Array.from(getGroupsFromElement(sentenceDiv, group))[0];

            var attributes = Array.from(wordGroup.attributes);
            var metaAttributes = attributes.filter(
                function(oneAttribute) {
                    return oneAttribute.nodeName.startsWith("data-meta-");
                }
            );
            metaAttributes.forEach(
                function (metaAttribute) {

                    var key = metaAttribute.nodeName.substr("data-meta-".length);
                    var value = metaAttribute.value;
 
                    var metaList = addMetaList(item);
                    var metaItem = createMetaListItem(
                        sentenceDiv,
                        group,
                        key,
                        value
                    );
                    metaList.appendChild(metaItem);
                }
            );
        }
    );
};

/**
 * @param {String}  group
 * @param {Element} sentenceDiv
 * @param {Element} listItem
 */
var addMetaInput = function(group, sentenceDiv, listItem) {
    
    this.disabled = true;
    var metaList = addMetaList(listItem);

    var liInputMeta = metaList.querySelector("li.metainput");
    if (liInputMeta === null) {
        liInputMeta = document.createElement("li");
        liInputMeta.classList.add("metainput");

        var form = document.createElement("form");

        var key = document.createElement("input");
        key.type = "text";
        key.name = "key";
        form.appendChild(key);

        var value = document.createElement("input");
        value.type = "text";
        value.name = "value";
        form.appendChild(value);

        var submit = document.createElement("input");
        submit.type = "submit";
        submit.value = "x";
        form.appendChild(submit);

        form.onsubmit = addMeta.bind(
            form,
            sentenceDiv,
            group,
            liInputMeta,
            metaList
        );

        liInputMeta.appendChild(form);
        metaList.appendChild(liInputMeta);

    }

    this.disabled = false;
};

/**
 *
 */
var addMetaList = function(listItem) {
    var metaList = listItem.querySelector("ul.meta");
    if (metaList === null) {
        metaList = document.createElement("ul");
        metaList.classList.add("meta");
        listItem.appendChild(metaList);
    }
    return metaList;
};

/**
 *
 */
var addMeta = function(
    sentenceDiv,
    group,
    liInputMeta,
    metaList
) {
    liInputMeta.remove();
    var key = this.key.value;
    var value = this.value.value;

    var wordGroups = Array.from(getGroupsFromElement(sentenceDiv, group));
    wordGroups.forEach(
        function(oneWordGroup) {
            oneWordGroup.setAttribute(
                'data-meta-'+key,
                value
            );
        }
    );

 
    var metaItem = createMetaListItem(
        sentenceDiv,
        group,
        key,
        value
    );

    metaList.appendChild(metaItem);
};

/**
 *
 */
var createMetaListItem = function(sentenceDiv, group, key, value) {
   var metaItem = document.createElement("li");
    metaItem.setAttribute("data-group", value);
    
    metaItem.appendChild(document.createTextNode(key + ":" + value));

    var remove = document.createElement("button");
    remove.setAttribute("data-key", key);
    remove.appendChild(document.createTextNode("remove"));
    remove.onclick = function() {
        var wordGroups = Array.from(getGroupsFromElement(sentenceDiv, group));
        wordGroups.forEach(
            function(oneWordGroup) {
                oneWordGroup.removeAttribute('data-meta-'+key);
            }
        );
        metaItem.remove();
    }.bind(remove);

    metaItem.appendChild(remove);
    return metaItem;
};


/**
 * TODO: duplicated code
 *
 * @param {Element}
 * @param {string}
 *
 * @return {NodeList}
 */
var getGroupsFromElement = function (element, group) {
    return element.querySelectorAll("[data-group='"+group+"']");
};


/**
 * TODO: duplicated code
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

return {
    addButton: addButton,
    save: save,
    generateMetaList: generateMetaList
};

}());
