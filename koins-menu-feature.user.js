// ==UserScript==
// @name         Koins Menu Feature
// @namespace    https://dev.1024.info/
// @version      0.1
// @description  Customize menu in studio.
// @author       Kasper
// @match        https://dev.1024.info/*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL  https://github.com/Kasp42/koins-menu-feature/raw/master/koins-menu-feature.user.js
// @updateURL    https://github.com/Kasp42/koins-menu-feature/raw/master/koins-menu-feature.user.js
// ==/UserScript==

let a_item_hide = GM_getValue('a_item_hide',{});
const CSS_HIDE_ITEM = {
  'text-decoration': 'line-through'
};
const CSS_SHOW_ITEM = {
  'text-decoration': ''
};

(function() {
    'use strict';

    var is_edit_mode = false;
    var jq_menu = $('.js-flyout-nav');
    var jq_menu_item = jq_menu.find('a[href]');
    jq_menu_item.each(function()
    {
      var jq_this = $(this);
      var url_menu = jq_this.attr('href');
      var a_id_source = url_menu.replace(/https?:\/\/dev\.1024\.info\/[a-z]{2}-[a-z]+\//,'').replace(/\.[a-z]+(\?.*)?/,'').split('/');
      var a_id = [];
      a_id_source.forEach(function(s_part)
      {
        s_part = s_part.toLowerCase();
        if(s_part.length)
        {
          s_part.split('-').forEach(function(s_sub_part)
          {
            s_sub_part = s_sub_part.toLowerCase();

            a_id.push(s_sub_part);
          });
        }
      });

      if(a_id.length)
      {
        var s_id = a_id.join('::');
        jq_this.data(s_id);
        if(a_item_hide.hasOwnProperty(s_id) && a_item_hide[s_id])
        {
          jq_this.addClass('js-item-hide').hide().css(CSS_HIDE_ITEM);
        }

        jq_this.on('click',function(event)
        {
          if(is_edit_mode)
          {
            event.preventDefault();

            var is_current_hide = jq_this.hasClass('js-item-hide');
            jq_this.toggleClass('js-item-hide',!is_current_hide).css(is_current_hide ? CSS_SHOW_ITEM : CSS_HIDE_ITEM);

            a_item_hide[s_id] = !is_current_hide;
            GM_setValue('a_item_hide',a_item_hide)
          }
        });
      }
    });
    normilizeMenu();

    $(window).keydown(function(event)
    {
      if(event.which === 72 && !is_edit_mode)
      {
        is_edit_mode = true;

        jq_menu.find('.js-item-hide').show();

        normilizeMenu();
      }
    }).keyup(function(event)
    {
      if(event.which === 72 && is_edit_mode)
      {
        is_edit_mode = false;

        jq_menu.find('.js-item-hide').hide();

        normilizeMenu();
      }
    });

    function normilizeMenu()
    {
      console.log('normalize');
      jq_menu.find('> ul > li').each(function()
      {
        var jq_item_list = $(this).find('> ul > li');
        var i_count = 0;
        var jq_separator_last = null;
        jq_item_list.each(function()
        {
          var jq_item = $(this);
          if(jq_item.hasClass('css-flyout-nav-separator'))
          {
            jq_item.toggle(!!i_count);
            if(jq_separator_last && !i_count)
            {
              jq_separator_last.toggle(!!i_count);
            }
            i_count = 0;
            jq_separator_last = jq_item;
            return;
          }
          var jq_link = jq_item.find('a');
          if(jq_link.length && jq_link.css('display') !== 'none')
            i_count++;
        });
      });
    }
})();
