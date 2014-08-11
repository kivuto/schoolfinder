/*
 * Foundation Responsive Library
 * http://foundation.zurb.com
 * Copyright 2013, ZURB
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */

/*jslint unparam: true, browser: true, indent: 2 */

// Accommodate running jQuery or Zepto in noConflict() mode by
// using an anonymous function to redefine the $ shorthand name.
// See http://docs.jquery.com/Using_jQuery_with_Other_Libraries
// and http://zeptojs.com/
var libFuncName = null;

if (typeof jQuery === "undefined" && typeof Zepto === "undefined" && typeof $ === "function") {
    libFuncName = $;
} else if (typeof jQuery === "function") {
    libFuncName = jQuery;
} else if (typeof Zepto === "function") {
    libFuncName = Zepto;
} else {
    throw new TypeError();
}

(function ($, window, document, undefined) {
    'use strict';

    // add dusty browser stuff
    if (!Array.prototype.filter) {
        Array.prototype.filter = function (fun /*, thisp */ ) {
            "use strict";

            if (this == null) {
                throw new TypeError();
            }

            var t = Object(this),
                len = t.length >>> 0;
            if (typeof fun != "function") {
                return;
            }

            var res = [],
                thisp = arguments[1];
            for (var i = 0; i < len; i++) {
                if (i in t) {
                    var val = t[i]; // in case fun mutates this
                    if (fun && fun.call(thisp, val, i, t)) {
                        res.push(val);
                    }
                }
            }

            return res;
        }
    }

    if (!Function.prototype.bind) {
        Function.prototype.bind = function (oThis) {
            if (typeof this !== "function") {
                // closest thing possible to the ECMAScript 5 internal IsCallable function
                throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
            }

            var aArgs = Array.prototype.slice.call(arguments, 1),
                fToBind = this,
                fNOP = function () {},
                fBound = function () {
                    return fToBind.apply(this instanceof fNOP && oThis ? this : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments)));
                };

            fNOP.prototype = this.prototype;
            fBound.prototype = new fNOP();

            return fBound;
        };
    }

    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
            "use strict";
            if (this == null) {
                throw new TypeError();
            }
            var t = Object(this);
            var len = t.length >>> 0;
            if (len === 0) {
                return -1;
            }
            var n = 0;
            if (arguments.length > 1) {
                n = Number(arguments[1]);
                if (n != n) { // shortcut for verifying if it's NaN
                    n = 0;
                } else if (n != 0 && n != Infinity && n != -Infinity) {
                    n = (n > 0 || -1) * Math.floor(Math.abs(n));
                }
            }
            if (n >= len) {
                return -1;
            }
            var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
            for (; k < len; k++) {
                if (k in t && t[k] === searchElement) {
                    return k;
                }
            }
            return -1;
        }
    }

    // fake stop() for zepto.
    $.fn.stop = $.fn.stop || function () {
        return this;
    };

    window.Foundation = {
        name: 'Foundation',

        version: '4.1.5',

        // global Foundation cache object
        cache: {},

        init: function (scope, libraries, method, options, response, /* internal */ nc) {
            var library_arr,
            args = [scope, method, options, response],
                responses = [],
                nc = nc || false;

            // disable library error catching,
            // used for development only
            if (nc) this.nc = nc;

            // check RTL
            this.rtl = /rtl/i.test($('html').attr('dir'));

            // set foundation global scope
            this.scope = scope || this.scope;

            if (libraries && typeof libraries === 'string') {
                if (/off/i.test(libraries)) return this.off();

                library_arr = libraries.split(' ');

                if (library_arr.length > 0) {
                    for (var i = library_arr.length - 1; i >= 0; i--) {
                        responses.push(this.init_lib(library_arr[i], args));
                    }
                }
            } else {
                for (var lib in this.libs) {
                    responses.push(this.init_lib(lib, args));
                }
            }

            // if first argument is callback, add to args
            if (typeof libraries === 'function') {
                args.unshift(libraries);
            }

            return this.response_obj(responses, args);
        },

        response_obj: function (response_arr, args) {
            for (var i = 0, len = args.length; i < len; i++) {
                if (typeof args[i] === 'function') {
                    return args[i]({
                        errors: response_arr.filter(function (s) {
                            if (typeof s === 'string') return s;
                        })
                    });
                }
            }

            return response_arr;
        },

        init_lib: function (lib, args) {
            // return this.trap(function () {
            if (this.libs.hasOwnProperty(lib)) {
                this.patch(this.libs[lib]);
                return this.libs[lib].init.apply(this.libs[lib], args);
            }
            // }.bind(this), lib);
        },

        trap: function (fun, lib) {
            if (!this.nc) {
                try {
                    return fun();
                } catch (e) {
                    return this.error({
                        name: lib,
                        message: 'could not be initialized',
                        more: e.name + ' ' + e.message
                    });
                }
            }

            return fun();
        },

        patch: function (lib) {
            this.fix_outer(lib);
            lib.scope = this.scope;
            lib.rtl = this.rtl;
        },

        inherit: function (scope, methods) {
            var methods_arr = methods.split(' ');

            for (var i = methods_arr.length - 1; i >= 0; i--) {
                if (this.lib_methods.hasOwnProperty(methods_arr[i])) {
                    this.libs[scope.name][methods_arr[i]] = this.lib_methods[methods_arr[i]];
                }
            }
        },

        random_str: function (length) {
            var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');

            if (!length) {
                length = Math.floor(Math.random() * chars.length);
            }

            var str = '';
            for (var i = 0; i < length; i++) {
                str += chars[Math.floor(Math.random() * chars.length)];
            }
            return str;
        },

        libs: {},

        // methods that can be inherited in libraries
        lib_methods: {
            set_data: function (node, data) {
                // this.name references the name of the library calling this method
                var id = [this.name, +new Date(), Foundation.random_str(5)].join('-');

                Foundation.cache[id] = data;
                node.attr('data-' + this.name + '-id', id);
                return data;
            },

            get_data: function (node) {
                return Foundation.cache[node.attr('data-' + this.name + '-id')];
            },

            remove_data: function (node) {
                if (node) {
                    delete Foundation.cache[node.attr('data-' + this.name + '-id')];
                    node.attr('data-' + this.name + '-id', '');
                } else {
                    $('[data-' + this.name + '-id]').each(function () {
                        delete Foundation.cache[$(this).attr('data-' + this.name + '-id')];
                        $(this).attr('data-' + this.name + '-id', '');
                    });
                }
            },

            throttle: function (fun, delay) {
                var timer = null;
                return function () {
                    var context = this,
                        args = arguments;
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        fun.apply(context, args);
                    }, delay);
                };
            },

            // parses data-options attribute on nodes and turns
            // them into an object
            data_options: function (el) {
                var opts = {}, ii, p,
                opts_arr = (el.attr('data-options') || ':').split(';'),
                    opts_len = opts_arr.length;

                function isNumber(o) {
                    return !isNaN(o - 0) && o !== null && o !== "" && o !== false && o !== true;
                }

                function trim(str) {
                    if (typeof str === 'string') return $.trim(str);
                    return str;
                }

                // parse options
                for (ii = opts_len - 1; ii >= 0; ii--) {
                    p = opts_arr[ii].split(':');

                    if (/true/i.test(p[1])) p[1] = true;
                    if (/false/i.test(p[1])) p[1] = false;
                    if (isNumber(p[1])) p[1] = parseInt(p[1], 10);

                    if (p.length === 2 && p[0].length > 0) {
                        opts[trim(p[0])] = trim(p[1]);
                    }
                }

                return opts;
            },

            delay: function (fun, delay) {
                return setTimeout(fun, delay);
            },

            // animated scrolling
            scrollTo: function (el, to, duration) {
                if (duration < 0) return;
                var difference = to - $(window).scrollTop();
                var perTick = difference / duration * 10;

                this.scrollToTimerCache = setTimeout(function () {
                    if (!isNaN(parseInt(perTick, 10))) {
                        window.scrollTo(0, $(window).scrollTop() + perTick);
                        this.scrollTo(el, to, duration - 10);
                    }
                }.bind(this), 10);
            },

            // not supported in core Zepto
            scrollLeft: function (el) {
                if (!el.length) return;
                return ('scrollLeft' in el[0]) ? el[0].scrollLeft : el[0].pageXOffset;
            },

            // test for empty object or array
            empty: function (obj) {
                if (obj.length && obj.length > 0) return false;
                if (obj.length && obj.length === 0) return true;

                for (var key in obj) {
                    if (hasOwnProperty.call(obj, key)) return false;
                }

                return true;
            }
        },

        fix_outer: function (lib) {
            lib.outerHeight = function (el, bool) {
                if (typeof Zepto === 'function') {
                    return el.height();
                }

                if (typeof bool !== 'undefined') {
                    return el.outerHeight(bool);
                }

                return el.outerHeight();
            };

            lib.outerWidth = function (el) {
                if (typeof Zepto === 'function') {
                    return el.width();
                }

                if (typeof bool !== 'undefined') {
                    return el.outerWidth(bool);
                }

                return el.outerWidth();
            };
        },

        error: function (error) {
            return error.name + ' ' + error.message + '; ' + error.more;
        },

        // remove all foundation events.
        off: function () {
            $(this.scope).off('.fndtn');
            $(window).off('.fndtn');
            return true;
        },

        zj: function () {
            try {
                return Zepto;
            } catch (e) {
                return jQuery;
            }
        }()
    };

    $.fn.foundation = function () {
        var args = Array.prototype.slice.call(arguments, 0);

        return this.each(function () {
            Foundation.init.apply(Foundation, [this].concat(args));
            return this;
        });
    };

}(libFuncName, this, this.document));


/*jslint unparam: true, browser: true, indent: 2 */

;
(function ($, window, document, undefined) {
    'use strict';

    Foundation.libs.forms = {
        name: 'forms',

        version: '4.1.6',

        cache: {},

        settings: {
            disable_class: 'no-custom',
            last_combo : null
        },

        init: function (scope, method, options) {

            if (typeof method === 'object') {
                $.extend(true, this.settings, method);
            }

            if (typeof method != 'string') {
                if (!this.settings.init) {
                    this.events();
                }

                this.assemble();

                return this.settings.init;
            } else {
                return this[method].call(this, options);
            }
        },

        assemble: function () {
            $('form.custom input[type="radio"]', $(this.scope)).not('[data-customforms="disabled"]')
                .each(this.append_custom_markup);
            $('form.custom input[type="checkbox"]', $(this.scope)).not('[data-customforms="disabled"]')
                .each(this.append_custom_markup);
            $('form.custom select', $(this.scope))
                .not('[data-customforms="disabled"]')
                .not('[multiple=multiple]')
                .each(this.append_custom_select);
        },

        events: function () {
            var self = this;

            $(this.scope)
                .on('click.fndtn.forms', 'form.custom span.custom.checkbox', function (e) {
                e.preventDefault();
                e.stopPropagation();
                self.toggle_checkbox($(this));
            })
                .on('click.fndtn.forms', 'form.custom span.custom.radio', function (e) {
                e.preventDefault();
                e.stopPropagation();
                self.toggle_radio($(this));
            })
                .on('change.fndtn.forms', 'form.custom select:not([data-customforms="disabled"])', function (e, force_refresh) {
                self.refresh_custom_select($(this), force_refresh);
            })
                .on('click.fndtn.forms', 'form.custom label', function (e) {
                var $associatedElement = $('#' + self.escape($(this).attr('for')) + ':not([data-customforms="disabled"])'),
                    $customCheckbox,
                    $customRadio;
                if ($associatedElement.length !== 0) {
                    if ($associatedElement.attr('type') === 'checkbox') {
                        e.preventDefault();
                        $customCheckbox = $(this).find('span.custom.checkbox');
                        //the checkbox might be outside after the label or inside of another element
                        if ($customCheckbox.length == 0) {
                            $customCheckbox = $associatedElement.add(this).siblings('span.custom.checkbox').first();
                        }
                        self.toggle_checkbox($customCheckbox);
                    } else if ($associatedElement.attr('type') === 'radio') {
                        e.preventDefault();
                        $customRadio = $(this).find('span.custom.radio');
                        //the radio might be outside after the label or inside of another element
                        if ($customRadio.length == 0) {
                            $customRadio = $associatedElement.add(this).siblings('span.custom.radio').first();
                        }
                        self.toggle_radio($customRadio);
                    }
                }
            })
                .on('click.fndtn.forms', 'form.custom div.custom.dropdown a.current, form.custom div.custom.dropdown a.selector', function (e) {
                var $this = $(this),
                    $dropdown = $this.closest('div.custom.dropdown'),
                    $select = $dropdown.prev();

                // make sure other dropdowns close
                if (!$dropdown.hasClass('open')) $(self.scope).trigger('click');

                e.preventDefault();
                if (false === $select.is(':disabled')) {
                    $dropdown.toggleClass('open');

                    if ($dropdown.hasClass('open')) {
                        $(self.scope).on('click.fndtn.forms.customdropdown', function () {
                            $dropdown.removeClass('open');
                            $(self.scope).off('.fndtn.forms.customdropdown');
                        });
                    } else {
                        $(self.scope).on('.fndtn.forms.customdropdown');
                    }
                    return false;
                }
            })
                .on('click.fndtn.forms touchend.fndtn.forms', 'form.custom div.custom.dropdown li', function (e) {
                var $this = $(this),
                    $customDropdown = $this.closest('div.custom.dropdown'),
                    $select = $customDropdown.prev(),
                    selectedIndex = 0;

                e.preventDefault();
                e.stopPropagation();

                if (!$(this).hasClass('disabled')) {
                    $('div.dropdown').not($customDropdown).removeClass('open');

                    var $oldThis = $this.closest('ul')
                        .find('li.selected');
                    $oldThis.removeClass('selected');

                    $this.addClass('selected');

                    $customDropdown.removeClass('open')
                        .find('a.current')
                        .text($this.text());

                    $this.closest('ul').find('li').each(function (index) {
                        if ($this[0] == this) {
                            selectedIndex = index;
                        }

                    });
                    $select[0].selectedIndex = selectedIndex;

                    //store the old value in data
                    $select.data('prevalue', $oldThis.html());
                    $select.trigger('change');
                }
            });

            $(window).on('keydown', function (e) {
                var focus = document.activeElement,
                    self = Foundation.libs.forms,
                    dropdown = $('.custom.dropdown.open');

                if (dropdown.length > 0) {
                    e.preventDefault();

                    if (e.which === 13) {
                        dropdown.find('li.selected').trigger('click');
                    }
                    
                    if (e.which === 27) {
                        dropdown.removeClass('open');
                    }

                    if (e.which >= 65 && e.which <= 90) {
                        var next = self.go_to(dropdown, e.which),
                            current = dropdown.find('li.selected');

                        if (next) {
                            current.removeClass('selected');
                            self.scrollTo(next.addClass('selected'), 300);
                        }
                    }

                    if (e.which === 38) {
                        var current = dropdown.find('li.selected'),
                            prev = current.prev(':not(.disabled)');

                        if (prev.length > 0) {
                            prev.parent()[0].scrollTop = prev.parent().scrollTop() - self.outerHeight(prev);
                            current.removeClass('selected');
                            prev.addClass('selected');
                        }
                    } else if (e.which === 40) {
                        var current = dropdown.find('li.selected'),
                            next = current.next(':not(.disabled)');

                        if (next.length > 0) {
                            next.parent()[0].scrollTop = next.parent().scrollTop() + self.outerHeight(next);
                            current.removeClass('selected');
                            next.addClass('selected');
                        }
                    }
                }
            });

            this.settings.init = true;
        },

        go_to: function (dropdown, char) {
            var lis = dropdown.find('li'),
                count = lis.length;

            if (count > 0) {
                for (var i = 0; i < count; i++) {
                    var first_letter = lis.eq(i).text().charAt(0).toLowerCase();
                    if (first_letter === String.fromCharCode(char).toLowerCase()) return lis.eq(i);
                }
            }
        },

        scrollTo: function (el, duration) {
            if (duration < 0) return;
            var parent = el.parent();
            var li_height = this.outerHeight(el);
            var difference = (li_height * (el.index())) - parent.scrollTop();
            var perTick = difference / duration * 10;

            this.scrollToTimerCache = setTimeout(function () {
                if (!isNaN(parseInt(perTick, 10))) {
                    parent[0].scrollTop = parent.scrollTop() + perTick;
                    this.scrollTo(el, duration - 10);
                }
            }.bind(this), 10);
        },

        append_custom_markup: function (idx, sel) {
            var $this = $(sel).addClass('hidden-field'),
                type = $this.attr('type'),
                $span = $this.next('span.custom.' + type);

            if ($span.length === 0) {
                $span = $('<span class="custom ' + type + '"></span>').insertAfter($this);
            }

            $span.toggleClass('checked', $this.is(':checked'));
            $span.toggleClass('disabled', $this.is(':disabled'));
        },

        append_custom_select: function (idx, sel) {
            var self = Foundation.libs.forms,
                $this = $(sel),
                $customSelect = $this.next('div.custom.dropdown'),
                $customList = $customSelect.find('ul'),
                $selectCurrent = $customSelect.find(".current"),
                $selector = $customSelect.find(".selector"),
                $options = $this.find('option'),
                $selectedOption = $options.filter(':selected'),
                copyClasses = $this.attr('class') ? $this.attr('class').split(' ') : [],
                maxWidth = 0,
                liHtml = '',
                $listItems,
                $currentSelect = false;

            if ($this.hasClass(self.settings.disable_class)) return;

            if ($customSelect.length === 0) {
                var customSelectSize = $this.hasClass('small') ? 'small' : $this.hasClass('medium') ? 'medium' : $this.hasClass('large') ? 'large' : $this.hasClass('expand') ? 'expand' : '';

                $customSelect = $('<div class="' + ['custom', 'dropdown', customSelectSize].concat(copyClasses).filter(function (item, idx, arr) {
                    if (item == '') return false;
                    return arr.indexOf(item) == idx;
                }).join(' ') + '"><a href="#" class="selector"></a><ul /></div>');
                $selector = $customSelect.find(".selector");
                $customList = $customSelect.find("ul");
                liHtml = $options.map(function () {
                    return "<li>" + $(this).html() + "</li>";
                }).get().join('');
                $customList.append(liHtml);
                $currentSelect = $customSelect.prepend('<a href="#" class="current">' + $selectedOption.html() + '</a>').find(".current");
                $this.after($customSelect)
                    .addClass('hidden-field');

            } else {
                liHtml = $options.map(function () {
                    return "<li>" + $(this).html() + "</li>";
                })
                    .get().join('');
                $customList.html('')
                    .append(liHtml);

            } // endif $customSelect.length === 0

            self.assign_id($this, $customSelect);
            $customSelect.toggleClass('disabled', $this.is(':disabled'));
            $listItems = $customList.find('li');

            // cache list length
            self.cache[$customSelect.data('id')] = $listItems.length;

            $options.each(function (index) {
                if (this.selected) {
                    $listItems.eq(index).addClass('selected');

                    if ($currentSelect) {
                        $currentSelect.html($(this).html());
                    }

                }
                if ($(this).is(':disabled')) {
                    $listItems.eq(index).addClass('disabled');
                }
            });

            //
            // If we're not specifying a predetermined form size.
            //
            if (!$customSelect.is('.small, .medium, .large, .expand')) {

                // ------------------------------------------------------------------------------------
                // This is a work-around for when elements are contained within hidden parents.
                // For example, when custom-form elements are inside of a hidden reveal modal.
                //
                // We need to display the current custom list element as well as hidden parent elements
                // in order to properly calculate the list item element's width property.
                // -------------------------------------------------------------------------------------

                $customSelect.addClass('open');
                //
                // Quickly, display all parent elements.
                // This should help us calcualate the width of the list item's within the drop down.
                //
                var self = Foundation.libs.forms;
                self.hidden_fix.adjust($customList);

                maxWidth = (self.outerWidth($listItems) > maxWidth) ? self.outerWidth($listItems) : maxWidth;

                Foundation.libs.forms.hidden_fix.reset();

                $customSelect.removeClass('open');

            } // endif

        },

        assign_id: function ($select, $customSelect) {
            var id = [+new Date(), Foundation.random_str(5)].join('-');
            $select.attr('data-id', id);
            $customSelect.attr('data-id', id);
        },

        refresh_custom_select: function ($select, force_refresh) {
            var self = this;
            var maxWidth = 0,
                $customSelect = $select.next(),
                $options = $select.find('option'),
                $listItems = $customSelect.find('li');

            if ($listItems.length != this.cache[$customSelect.data('id')] || force_refresh) {
                $customSelect.find('ul').html('');

                $options.each(function () {
                    var $li = $('<li>' + $(this).html() + '</li>');
                    $customSelect.find('ul').append($li);
                });

                // re-populate
                $options.each(function (index) {
                    if (this.selected) {
                        $customSelect.find('li').eq(index).addClass('selected');
                        $customSelect.find('.current').html($(this).html());
                    }
                    if ($(this).is(':disabled')) {
                        $customSelect.find('li').eq(index).addClass('disabled');
                    }
                });

                // fix width
                $customSelect.removeAttr('style')
                    .find('ul').removeAttr('style');
                $customSelect.find('li').each(function () {
                    $customSelect.addClass('open');
                    if (self.outerWidth($(this)) > maxWidth) {
                        maxWidth = self.outerWidth($(this));
                    }
                    $customSelect.removeClass('open');
                });

                $listItems = $customSelect.find('li');
                // cache list length
                this.cache[$customSelect.data('id')] = $listItems.length;

            }
        },

        toggle_checkbox: function ($element) {
            var $input = $element.prev(),
                input = $input[0];

            if (false === $input.is(':disabled')) {
                input.checked = ((input.checked) ? false : true);
                $element.toggleClass('checked');

                $input.trigger('change');
            }
        },

        toggle_radio: function ($element) {
            var $input = $element.prev(),
                $form = $input.closest('form.custom'),
                input = $input[0];

            if (false === $input.is(':disabled')) {
                $form.find('input[type="radio"][name="' + this.escape($input.attr('name')) + '"]').next().not($element).removeClass('checked');
                if (!$element.hasClass('checked')) {
                    $element.toggleClass('checked');
                }
                input.checked = $element.hasClass('checked');

                $input.trigger('change');
            }
        },

        escape: function (text) {
            return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
        },

        hidden_fix: {
            /**
             * Sets all hidden parent elements and self to visibile.
             *
             * @method adjust
             * @param {jQuery Object} $child
             */

            // We'll use this to temporarily store style properties.
            tmp: [],

            // We'll use this to set hidden parent elements.
            hidden: null,

            adjust: function ($child) {
                // Internal reference.
                var _self = this;

                // Set all hidden parent elements, including this element.
                _self.hidden = $child.parents().andSelf().filter(":hidden");

                // Loop through all hidden elements.
                _self.hidden.each(function () {

                    // Cache the element.
                    var $elem = $(this);

                    // Store the style attribute.
                    // Undefined if element doesn't have a style attribute.
                    _self.tmp.push($elem.attr('style'));

                    // Set the element's display property to block,
                    // but ensure it's visibility is hidden.
                    $elem.css({
                        'visibility': 'hidden',
                        'display': 'block'
                    });
                });

            }, // end adjust

            /**
             * Resets the elements previous state.
             *
             * @method reset
             */
            reset: function () {
                // Internal reference.
                var _self = this;
                // Loop through our hidden element collection.
                _self.hidden.each(function (i) {
                    // Cache this element.
                    var $elem = $(this),
                        _tmp = _self.tmp[i]; // Get the stored 'style' value for this element.

                    // If the stored value is undefined.
                    if (_tmp === undefined)
                    // Remove the style attribute.
                    $elem.removeAttr('style');
                    else
                    // Otherwise, reset the element style attribute.
                    $elem.attr('style', _tmp);

                });
                // Reset the tmp array.
                _self.tmp = [];
                // Reset the hidden elements variable.
                _self.hidden = null;

            } // end reset

        },

        off: function () {
            $(this.scope).off('.fndtn.forms');
        }
    };
}(Foundation.zj, this, this.document));

$(document).foundation('forms');