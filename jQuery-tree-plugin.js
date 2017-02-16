/*
 * jQueryTree
 * */
(function ($, window) {
    $.fn.jQueryTree = function (settings) {

        var bindTreeElement = $(this);
        console.log(this);
        function getMenuPosition(mouse, direction, scrollDir) {
            var win = $(window)[direction](),
                scroll = $(window)[scrollDir](),
                menu = $("#jQuery-treeContextMenu")[direction](),
                position = mouse + scroll;

            // opening menu would pass the side of the page
            if (mouse + menu > win && menu < mouse)
                position -= menu;

            return position;
        }

        /*
         * append menu
         *
         * */

        var menuStr = "<ul id=\"jQuery-treeContextMenu\" style=\"display:none\">" +
            "<li style=\"list-style-type:none;\"><button>new item</button></li>" +
            " </ul>";
        $('body').append(menuStr);


        if (bindTreeElement.children('ul').length == 0) {
            bindTreeElement.append("<ul class='root'></ul>");
        }

        /*
         * load menu
         * */

        function writeTree(objArray) {
            $.each(objArray, function (index, value) {
                if (value.parentId == 0) {
                    bindTreeElement.find('ul.root').append("<li cId='" + value.id + "'>" + "<span class='menu-item' title='Collapse this branc'><i></i> " + value.name + "</span><input type='checkbox'  value='true'>" + "</li>");
                } else {
                    bindTreeElement.find("li[cId='" + value.parentId + "']").addClass('parent_li');
                    bindTreeElement.find("li[cId='" + value.parentId + "']").find("span:first > i").addClass("icon-minus-sign");
                    if (bindTreeElement.find("li[cId='" + value.parentId + "']").find("ul:first").length == 0) {
                        bindTreeElement.find("li[cId='" + value.parentId + "']").append("<ul><li cid='" + value.id + "'><span class='menu-item' title='Collapse this branc'><i class=''></i> " + value.name + "</span><input type='checkbox'  value='true'></li></ul>");
                    } else {
                        bindTreeElement.find("li[cId='" + value.parentId + "']").find("ul:first").append("<li cid='" + value.id + "'><span class='menu-item' title='Collapse this branc'><i class=''></i> " + value.name + "</span><input type='checkbox'  value='true'></li>");
                    }
                }
                if (value.children != null) {
                    writeTree(value.children);
                }
            });
        }

        $.ajax({
            url: settings.dataUrl,
            data: {},
            dataType: "json",
            success: function (resultData) {
                if (resultData.children != null) {
                    writeTree(resultData.children);
                }
            }
        });

        bindTreeElement.on('click', 'li.parent_li > span.menu-item', function (e) {
            var children = $(this).parent('li.parent_li').find(' > ul > li');
            if (children.is(":visible")) {
                children.hide('fast');
                $(this).attr('title', 'Expand this branch').find(' > i').addClass('icon-plus-sign').removeClass('icon-minus-sign');
            } else {
                children.show('fast');
                $(this).attr('title', 'Collapse this branch').find(' > i').addClass('icon-minus-sign').removeClass('icon-plus-sign');
            }
            e.stopPropagation();
        });

        bindTreeElement.on('contextmenu', 'li span.menu-item', function (e) {

            console.log("menu");

            // return native menu if pressing control
            if (e.ctrlKey) return;
            if (!settings.enableNewItem) return;

            //open menu
            var $menu = $("#jQuery-treeContextMenu")
                .data("invokedOn", $(e.target))
                .show()
                .css({
                    position: "absolute",
                    left: getMenuPosition(e.clientX, 'width', 'scrollLeft'),
                    top: getMenuPosition(e.clientY, 'height', 'scrollTop')
                })
                .off('click')
                .on('click', 'button', function (e) {
                    $menu.hide();

                    var $invokedOn = $menu.data("invokedOn");
                    var $selectedMenu = $(e.target);

                    var msg = "You selected the menu item '" + $selectedMenu.text() +
                        "' on the value '" + $invokedOn.text() + "'";

                    var itemName = prompt("Please input", "New Item");

                    if (itemName == null || itemName == "") {
                        return false;
                    }


                    if ($invokedOn.parent().find("ul").length > 0) {
                        var $newItem = $("<li> <span class='menu-item'><i class=''></i> " + itemName + "</span> <input type='checkbox'></li>");
                        $invokedOn.parent().find("ul:first").append($newItem);
                    } else {
                        var $newItem = $("<ul><li> <span class='menu-item'><i class=''></i> " + itemName + "</span> <input type='checkbox'></li></ul>");
                        $invokedOn.parent().addClass("parent_li");
                        $invokedOn.find("i:first").addClass("icon-minus-sign");
                        $invokedOn.parent().append($newItem);
                    }

                });

            return false;
        });

        //make sure menu closes on any click
        $('body').click(function () {
            $("#jQuery-treeContextMenu").hide();
        });


    };
})(jQuery, window);

