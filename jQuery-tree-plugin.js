(function ($, window) {
    $.fn.contextMenu = function (settings) {
        return this.each(function () {

            // Open context menu
            $(this).on("contextmenu", function (e) {
                // return native menu if pressing control
                if (e.ctrlKey) return;

                //open menu
                var $menu = $(settings.menuSelector)
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

                        settings.menuSelected.call(this, $invokedOn, $selectedMenu);
                    });

                return false;
            });

            //make sure menu closes on any click
            $('body').click(function () {
                $(settings.menuSelector).hide();
            });
        });

        function getMenuPosition(mouse, direction, scrollDir) {
            var win = $(window)[direction](),
                scroll = $(window)[scrollDir](),
                menu = $(settings.menuSelector)[direction](),
                position = mouse + scroll;

            // opening menu would pass the side of the page
            if (mouse + menu > win && menu < mouse)
                position -= menu;

            return position;
        }

    };
})(jQuery, window);


$(function () {

    /*
     * append menu
     *
     *
     * */


    var menuStr = "<ul id=\"jQuery-treeContextMenu\" style=\"display:none\">" +
        "<li style=\"list-style-type:none;\"><button>new item</button></li>" +
        " </ul>";
    $('body').append(menuStr);

    $('.jQuery-tree li:has(ul)').addClass('parent_li').find(' > span.menu-item').attr('title', 'Collapse this branch');
    $('.jQuery-tree li.parent_li > span.menu-item').on('click', function (e) {
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

    $("ul .menu-item").contextMenu({
        menuSelector: "#jQuery-treeContextMenu",
        menuSelected: function (invokedOn, selectedMenu) {
            var msg = "You selected the menu item '" + selectedMenu.text() +
                "' on the value '" + invokedOn.text() + "'";

            var itemName = prompt("Please input", "New Item");


            if (invokedOn.parent().find("ul").length > 0) {
                var $newItem = $("<li> <span class='menu-item'><i class='icon-leaf'></i> " + itemName + "</span> <input type='checkbox' checked='checked'></li>");
                invokedOn.parent().find("ul:first").append($newItem);
            } else {
                var $newItem = $("<ul><li> <span class='menu-item'><i class='icon-leaf'></i> " + itemName + "</span> <input type='checkbox' checked='checked'></li></ul>");
                invokedOn.parent().append($newItem);
            }


        }
    });
});