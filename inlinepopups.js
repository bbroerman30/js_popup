  //
  // This keeps track of all the declared popup windows. 
  //
  window.inlinePopupWindowObjPointers = new Array;
  
  //
  // This keeps track of parameters that are passed to an inline popup in an iFrame.
  window.inlinePopupWindowParamsHolder = new Array;
  
  //
  // Install the stylesheet for the popup windows.
  //
  var basedir = getPopupScriptBase();
  
  if(document.createStyleSheet) 
  {
      document.createStyleSheet(basedir + 'clearlooks.css');
  }
  else 
  {
      var newSS=document.createElement('link');
      newSS.rel='stylesheet';
      newSS.href = basedir + 'clearlooks.css';
      document.getElementsByTagName("head")[0].appendChild(newSS);
  }

  //
  // This is the constructor for the popup window class.
  //
  function Popup( x, y, width, height, title, options, contentHtml, url, parameters)
  {
      var that = this; 
      var isModal = false;
      
      window.inlinePopupWindowObjPointers.push( that );      

      var popupDiv = document.createElement("div");         
      popupDiv.id = "mce_" + window.inlinePopupWindowObjPointers.length;
      popupDiv.className = "clearlooks2";
      popupDiv.style.overflow ="auto";
      popupDiv.style.left = x + "px";
      popupDiv.style.top = y + "px";
      popupDiv.style.width = width + "px";
      popupDiv.style.height = height + "px";
      popupDiv.style.zIndex = 30005;        
      document.getElementsByTagName('body')[0].appendChild(popupDiv);
  
      var dragCover = document.createElement("div");
      dragCover.style.display='none';
      dragCover.className = 'clearlooks2_modalBlocker';
      popupDiv.appendChild(dragCover);

      // Fix an IE bug with transparent DIVs as an event blocker...
      if( document.attachEvent )
          dragCover.style.backgroundColor="#000000";

      dragCover.style.position = 'absolute';
      dragCover.style.left = "4px";
      dragCover.style.top = "4px";
      dragCover.style.width = (width - 8) + "px";
      dragCover.style.height = (height-8) + "px";
      dragCover.style.zIndex = parseInt(popupDiv.style.zIndex) + 1;              
  
      var modalBlocker = document.createElement("div");
      modalBlocker.className = 'clearlooks2_modalBlocker';
      modalBlocker.style.display = 'none';
      modalBlocker.style.zIndex = parseInt(popupDiv.style.zIndex) - 1;              
      document.body.appendChild(modalBlocker);
  
      //
      // Use the passed in options to set the className for the wrapper.
      //
      var optionsArray = options.split("|");
      var wrapperClass = "mceWrapper";
      var middlescroll = false;
      for( var idx = 0; idx < optionsArray.length; ++idx )
      {
          if( optionsArray[idx].toLowerCase() == "min" )
              wrapperClass += " mceMinimizable";
          else if( optionsArray[idx].toLowerCase() == "max" )
              wrapperClass += " mceMaximizable";
          else if( optionsArray[idx].toLowerCase() == "resize" )
              wrapperClass += " mceResizable";
          else if( optionsArray[idx].toLowerCase() == "move" )
              wrapperClass += " mceMovable";
          else if( optionsArray[idx].toLowerCase() == "status" )
              wrapperClass += " mceStatusbar";
          else if( optionsArray[idx].toLowerCase() == "focus" )
              wrapperClass += " mceFocus";
          else if( optionsArray[idx].toLowerCase() == "scroll" )
              middlescroll = true;              
          else if( optionsArray[idx].toLowerCase() == "modal" )
              isModal = true;              
      }
  
      var popupWrapper = document.createElement("div");
      popupWrapper.id = popupDiv.id + "_wrapper";
      popupWrapper.className = wrapperClass;
      popupDiv.appendChild( popupWrapper );
    
      var mce_top = document.createElement("div");
      mce_top.id = popupDiv.id + "_top";
      mce_top.className = "mceTop";
      popupWrapper.appendChild(mce_top);
      
      mce_top.appendChild( document.createElement("div") ).className = "mceLeft";
      mce_top.appendChild( document.createElement("div") ).className = "mceCenter";
      mce_top.appendChild( document.createElement("div") ).className = "mceRight";
      var mce_title = mce_top.appendChild( document.createElement("span") )
      mce_title.id = popupDiv.id + "_title";
      mce_title.appendChild( document.createTextNode(title) );
      mce_top.style.zIndex = parseInt(popupDiv.style.zIndex) + 1;
      
      var minHeight = parseInt(getStyle(mce_top,'height')) + 5;
      
      var mce_middle = popupWrapper.appendChild( document.createElement("div") );
      mce_middle.id = popupDiv.id + "_middle";
      mce_middle.className = "mceMiddle";
            
      var mce_left = mce_middle.appendChild( document.createElement("div") );
      mce_left.id = popupDiv.id + "_left";
      mce_left.className = "mceLeft";
      
      var mce_content = mce_middle.appendChild( document.createElement("span") );
      mce_content.id = popupDiv.id + "_content";

      var mce_detailcontent = null;
      if( null == url )
      {
          mce_detailcontent = mce_content.appendChild( document.createElement("div") );
          
          // show close and/or cancel buttons...
      }
      else
      {
          mce_detailcontent = mce_content.appendChild(document.createElement("iframe"));                    
      }

      if( middlescroll )
      mce_detailcontent.style.overflow = 'auto';
            
      mce_detailcontent.id = popupDiv.id + "_detailcontent";   
      mce_detailcontent.className = "mceContent";
      mce_detailcontent.style.border = "0pt none";
      mce_detailcontent.style.width = ( width - 10 ) + "px";
      mce_detailcontent.style.height = ( height - 29) + "px";
      
      
      if( null == url )
      {
          mce_detailcontent.innerHTML = contentHtml;
      }
      else
      {
          if( parameters )
          {
              parameters.inline_popup_Obj = this;
              window.inlinePopupWindowParamsHolder[mce_detailcontent.id] = parameters;
          }
          mce_detailcontent.src = url;                 
      }
      
      var mce_right = mce_middle.appendChild( document.createElement("div") );
      mce_right.id = popupDiv.id + "_right";
      mce_right.className = "mceRight";
      
      var mce_bottom = popupWrapper.appendChild( document.createElement("div") );
      mce_bottom.id = popupDiv.id + "_bottom";
      mce_bottom.className = "mceBottom";
      
      mce_bottom.appendChild( document.createElement("div") ).className = "mceLeft";
      mce_bottom.appendChild( document.createElement("div") ).className = "mceCenter";
      mce_bottom.appendChild( document.createElement("div") ).className = "mceRight";
      var mce_status = mce_bottom.appendChild( document.createElement("span") )
      mce_status.id = popupDiv.id + "_status";

      var mce_move = popupWrapper.appendChild( document.createElement("a") );
      mce_move.className = "mceMove";
      mce_move.tabindex = "-1";
      mce_move.href="javascript:;";
      mce_move.style.zIndex = mce_top.style.zIndex;

      var mce_min = popupWrapper.appendChild( document.createElement("a") );
      mce_min.className = "mceMin";
      mce_min.tabindex = "-1";
      mce_min.href="javascript:;";
      mce_min.onmousedown = function() { return false;};
      mce_min.style.zIndex = mce_top.style.zIndex;
      
      var mce_max = popupWrapper.appendChild( document.createElement("a") );
      mce_max.className = "mceMax";
      mce_max.tabindex = "-1";
      mce_max.href="javascript:;";
      mce_max.onmousedown = function() { return false;};
      mce_max.style.zIndex = mce_top.style.zIndex;
      
      var mce_med = popupWrapper.appendChild( document.createElement("a") );
      mce_med.className = "mceMed";
      mce_med.tabindex = "-1";
      mce_med.href="javascript:;";
      mce_med.onmousedown = function() { return false;};
      mce_med.style.zIndex = mce_top.style.zIndex;

      var mce_close = popupWrapper.appendChild( document.createElement("a") );
      mce_close.className = "mceClose";
      mce_close.tabindex = "-1";
      mce_close.href="javascript:;";
      mce_close.onmousedown = function() { return false;};
      mce_close.style.zIndex = mce_top.style.zIndex;

      var minWidth = parseInt(getStyle(mce_close,"width")) * 6;

      var mce_res_n = popupWrapper.appendChild( document.createElement("a") );
      mce_res_n.id = popupDiv.id + "_resize_n";
      mce_res_n.className = "mceResize mceResizeN";
      mce_res_n.tabindex = "-1";
      mce_res_n.href="javascript:;";
      mce_res_n.style.zIndex = mce_top.style.zIndex;
    
      var mce_res_s = popupWrapper.appendChild( document.createElement("a") );
      mce_res_s.id = popupDiv.id + "_resize_s";
      mce_res_s.className = "mceResize mceResizeS";
      mce_res_s.tabindex = "-1";
      mce_res_s.href="javascript:;";
      
      var mce_res_w = popupWrapper.appendChild( document.createElement("a") );
      mce_res_w.id = popupDiv.id + "_resize_w";
      mce_res_w.className = "mceResize mceResizeW";
      mce_res_w.tabindex = "-1";
      mce_res_w.href="javascript:;";
      
      var mce_res_e = popupWrapper.appendChild( document.createElement("a") );
      mce_res_e.id = popupDiv.id + "_resize_e";
      mce_res_e.className = "mceResize mceResizeE";
      mce_res_e.tabindex = "-1";
      mce_res_e.href="javascript:;";
      
      var mce_res_nw = popupWrapper.appendChild( document.createElement("a") );
      mce_res_nw.id = popupDiv.id + "_resize_nw";
      mce_res_nw.className = "mceResize mceResizeNW";
      mce_res_nw.tabindex = "-1";
      mce_res_nw.href="javascript:;";
      mce_res_nw.style.zIndex = mce_top.style.zIndex;
      
      var mce_res_ne = popupWrapper.appendChild( document.createElement("a") );
      mce_res_ne.id = popupDiv.id + "_resize_ne";
      mce_res_ne.className = "mceResize mceResizeNE";
      mce_res_ne.tabindex = "-1";
      mce_res_ne.href="javascript:;";
      mce_res_ne.style.zIndex = mce_top.style.zIndex;
      
      var mce_res_sw = popupWrapper.appendChild( document.createElement("a") );
      mce_res_sw.id = popupDiv.id + "_resize_sw";
      mce_res_sw.className = "mceResize mceResizeSW";
      mce_res_sw.tabindex = "-1";
      mce_res_sw.href="javascript:;";
      
      var mce_res_se = popupWrapper.appendChild( document.createElement("a") );
      mce_res_se.id = popupDiv.id + "_resize_se";
      mce_res_se.className = "mceResize mceResizeSE";
      mce_res_se.tabindex = "-1";
      mce_res_se.href="javascript:;";

      // Private function used to set the Zindexes for other operations
      function setZIndex( index )
      {
          popupDiv.style.zIndex = index;
		  modalBlocker.style.zIndex = parseInt(popupDiv.style.zIndex) - 1;
          mce_top.style.zIndex = parseInt(popupDiv.style.zIndex) + 1;
          dragCover.style.zIndex = mce_top.style.zIndex;
          mce_move.style.zIndex = mce_top.style.zIndex;
          mce_min.style.zIndex = mce_top.style.zIndex;
          mce_max.style.zIndex = mce_top.style.zIndex;
          mce_med.style.zIndex = mce_top.style.zIndex;
          mce_close.style.zIndex = mce_top.style.zIndex;

          mce_res_n.style.zIndex = mce_top.style.zIndex;
          mce_res_nw.style.zIndex = mce_top.style.zIndex;
          mce_res_ne.style.zIndex = mce_top.style.zIndex;      
      }
    
      // Used to keep the status of the window, so that other windows can query it.
      this.wrapper = popupWrapper;
    
      // Protected variables used in drag & drop.
      this.dragObj = null;
      this.offsetX = 0;
      this.offsetY = 0;

      // Protected variables used in dragging the resize bars.
      this.resizeDir = null;
      this.startX = 0;
      this.startY = 0;
      this.startLeft = 0;
      this.startTop= 0;
      this.startWidth = 0;
      this.startHeight = 0;

      // Protected variables used in minimize, maximize, and restore.
      this.oldX = 0;
      this.oldY = 0;
      this.oldWidth = 0;
      this.oldHeight = 0;
      
      // These values determine the bounding box for resize, move, minimize, and maximize.
      // These are only used when the user sets the bounding box.
      this.minLeft = 0;
      this.minTop = 0;
      this.maxLeft = 0;
      this.maxTop = 0;
      
      // These are used when the user sets a minimum width, or minimum height. 
      // They can not be smaller than the default minWidth and minHeight.
      this.minResizeWidth = 0;
      this.minResizeHeight = 0;
      
      // Event Handler callbacks.
      this.contentResizeHndlr = null;
      this.closeHandler = null;

      // Protected functions that are used for event handlers.
      
      this.startMove = function( e )
      {
          // IE Bug Fix (first check for IE)
          if(!objHasClass( popupWrapper, "mceFocus" ) )
          {
              that.focus();
          }
          
          dragCover.style.display = 'block';
             
          var offsets= getObjPosition(popupDiv);
          var mousepos = mouseCoords(e);
       
          that.offsetX = mousepos.x - offsets.x - 1;
          that.offsetY = mousepos.y - offsets.y - 1 ;                 
          that.dragObj = popupDiv;    
          
          setEventHandler( document, "onmousemove", that.dragDiv);          
          setEventHandler( document, "onmouseup", that.endDrag);


          if (window.event) 
          {
              window.event.cancelBubble = true;
              window.event.returnValue = false;
          }
          if( e.preventDefault )
          {
              e.preventDefault();
          }
          
          // now cancel the bubble...
          e.cancelBubble = true;             
          if(e.stopPropagation)
             e.stopPropagation();           
      }
        
      this.dragDiv = function( e )
      {
          if( that.dragObj != null )
          {
          
              var mousepos = mouseCoords(e);
       
              var objX = mousepos.x - that.offsetX;
              var objY = mousepos.y - that.offsetY;
   
              that.dragObj.style.left = objX + "px";
              that.dragObj.style.top = objY + "px";
 
              // TODO: Check bounding box (if set) and limit drag.
                          
              currLeft = objX;
              currTop = objY;
          }
      
          if (window.event) 
          {
              window.event.cancelBubble = true;
              window.event.returnValue = false;
          }
          if( e.preventDefault )
          {           
              e.preventDefault();
          }
      }

      this.endDrag = function( e )
      {
          that.dragObj = null;
          dragCover.style.display = 'none';
          
          // This works because we're only dragging ONE window at a time...
          removeEventHandler( document, "onmousemove" );
          removeEventHandler( document, "onmouseup" );
      } 
      
      this.showStatusbar = function()
      {
          var oldBottomHeight = parseInt(getStyle(mce_bottom,'height'));
      
          objAddClass( popupWrapper, "mceStatusbar" );

          var newBottomHeight = parseInt(getStyle(mce_bottom,'height'));

          that.oldHeight = parseInt(getStyle(popupDiv,'height')) + newBottomHeight - oldBottomHeight; 
		  popupDiv.style.height = that.oldHeight + "px";
          mce_detailcontent.style.height = ( that.oldHeight - 29 ) + "px";
          dragCover.style.height = ( that.oldHeight - 8) + "px";
      }
    
      this.hideStatusbar = function()
      {
          var oldBottomHeight = parseInt(getStyle(mce_bottom,'height'));
      
          objDeleteClass( popupWrapper, "mceStatusbar" );  

          var newBottomHeight = parseInt(getStyle(mce_bottom,'height'));

          that.oldHeight = parseInt(getStyle(popupDiv,'height')) + newBottomHeight - oldBottomHeight; 
		  popupDiv.style.height = that.oldHeight + "px";
          mce_detailcontent.style.height = ( that.oldHeight - 29 ) + "px";
          dragCover.style.height = ( that.oldHeight - 8) + "px";
      }
  
      this.setStatusText = function( message )
      {
          mce_status.innerHTML = message;
      }

      this.focus = function( )
      {
          dragCover.style.display = 'none';
          objAddClass( popupWrapper, "mceFocus" );          
          setZIndex( 30005 );
          
          for(var idx = 0; idx < window.inlinePopupWindowObjPointers.length; ++idx )
          {
              if( window.inlinePopupWindowObjPointers[idx] === that )
              {
                  window.inlinePopupWindowObjPointers.splice(idx,1);
                  window.inlinePopupWindowObjPointers.unshift(that);
                  break;
              }
          }
          
          for(var idx = 1; idx < window.inlinePopupWindowObjPointers.length; ++idx )
          {
              window.inlinePopupWindowObjPointers[idx].loseFocus();
          }         
      }
  
      this.loseFocus = function( )
      {
          objDeleteClass( popupWrapper, "mceFocus" );
          dragCover.style.display = 'block';
	
		  var idx = 0;
          for( ; idx < window.inlinePopupWindowObjPointers.length; ++idx )
          {
              if( window.inlinePopupWindowObjPointers[idx] === that )
              {
			      break;
		      }
		  }
		  
          setZIndex( 20005 - ( idx * 5 ) );
      }
      
      this.show = function( )
      {
           popupDiv.style.display = 'block';

           if(isModal)
           {
               modalBlocker.style.display = 'block';
           }
      }
        
      this.hide = function( )
      {
           popupDiv.style.display = 'none';
           modalBlocker.style.display = 'none';
      }
      
      this.close = function()
      {
          that.hide();
          document.getElementsByTagName('body')[0].removeChild(popupDiv);
		  document.getElementsByTagName('body')[0].removeChild(modalBlocker);
          
          for(var idx = 0; idx < window.inlinePopupWindowObjPointers.length; ++idx )
          {
              if( window.inlinePopupWindowObjPointers[idx] === that )
              {
                  window.inlinePopupWindowObjPointers.splice(idx,1);
                  break;
              }
          }
          
          if( window.inlinePopupWindowObjPointers[0] )
          {
              window.inlinePopupWindowObjPointers[0].focus();    
          }
          
          if( that.closeHandler )
          {
              that.closeHandler();
          }          
      }

      this.setMinWidth = function( minw )
      {
          that.minResizeWidth = minw;
      }

      this.setMinHeight = function( minh )
      {
          that.minResizeHeight = minh;
      }
       
      this.startResize = function( e )
      {           
          // IE Bug Fix (first check for IE)
          if(!objHasClass( popupWrapper, "mceFocus" ) )
          {
              that.focus();
          }

          that.startX = e.clientX;
          that.startY = e.clientY;    
          var offsets= getObjPosition(popupDiv);
          that.startLeft = offsets.x;
          that.startTop = offsets.y;
          that.startWidth = parseInt(getStyle(popupDiv,"width"));
          that.startHeight = parseInt(getStyle(popupDiv,"height"));
          
          dragCover.style.display = 'block';
          
          var target = (e.target)?e.target:e.srcElement;
          
          var direction = target.id.substr( target.id.lastIndexOf("_") + 1,2).toUpperCase();
          
          that.resizeDir = direction;    
          
          setEventHandler( document, "onmousemove", that.resizeDrag);          
          setEventHandler( document, "onmouseup", that.resizeEnd);

          if (window.event) 
          {
              window.event.cancelBubble = true;
              window.event.returnValue = false;
          }
          if( e.preventDefault )
          {
              e.preventDefault();
          }           
          
          // now cancel the bubble...
          e.cancelBubble = true;             
          if(e.stopPropagation)
             e.stopPropagation();           
      }
      
      this.resizeDrag = function( e )
      {
         if( that.resizeDir == null )
             return false;
             
         var dX = e.clientX - that.startX;
         var dY = e.clientY - that.startY;
             
         var newTop = that.startTop;
         var newLeft = that.startLeft;
         var newWidth = that.startWidth;
         var newHeight = that.startHeight;
 
         if( that.resizeDir.indexOf('E') > -1)
         {
             newWidth += dX;
         }
         else if ( that.resizeDir.indexOf("W") > -1)
         { 
             newWidth -= dX;
             newLeft += dX;
         }
         
         if ( that.resizeDir.indexOf("N") > -1)
         {
             newTop += dY;
             newHeight -= dY;
         }
         else if ( that.resizeDir.indexOf("S") > -1)
         {
             newHeight += dY;
         }

         // TODO: Check bounding box (if set) and limit drag.
         
         if( newHeight > minHeight && newHeight > that.minResizeHeight )
         {
             popupDiv.style.height = newHeight + "px";
             popupDiv.style.top = newTop + "px";
             mce_detailcontent.style.height = ( newHeight - 29 ) + "px";
             dragCover.style.height = (newHeight-8) + "px";
         }
         
         if( newWidth > minWidth && newWidth > that.minResizeWidth )
         {
             popupDiv.style.left = newLeft + "px";
             popupDiv.style.width = newWidth + "px";
             mce_detailcontent.style.width = ( newWidth  - 10 ) + "px";
             dragCover.style.width = (newWidth-8) + "px";
         }

         if( null != that.contentResizeHndlr )
         {
             that.contentResizeHndlr(newWidth - 10, newHeight - 29);
         }

         if (window.event) 
         {
             window.event.cancelBubble = true;
             window.event.returnValue = false;
         }
         
         if( e.preventDefault )
         {
             e.preventDefault();
         }     
      }
      
      this.resizeEnd = function( e )
      {
          that.resizeDir = null;
          removeEventHandler( document, "onmousemove" );
          removeEventHandler( document, "onmouseup" );
          dragCover.style.display = 'none';
      }
      
      this.minimize = function( )
      {
          // Get the old location and size.
          var offsets= getObjPosition(popupDiv);
          that.oldX = offsets.x;
          that.oldY = offsets.y;
          that.oldWidth = parseInt(getStyle(popupDiv,'width'));
          that.oldHeight = parseInt(getStyle(popupDiv,'height'));
                  
          // set the size to the minimum
          popupDiv.style.height = minHeight + "px";
          mce_detailcontent.style.height = "0px";
          popupDiv.style.width = minWidth + "px";
          mce_detailcontent.style.width = "0px";
          dragCover.style.height = "0px";
          dragCover.style.width = "0px";
          
          // move it to the bottom of the screen.
          var windowSize = getWindowSize();
          var scrollPos = getScrollPosn();

          // If there is another minimized window, move this one over...
          var offsetArray = new Array;
          for( var idx = 0; idx < window.inlinePopupWindowObjPointers.length; ++idx )
          {
              if( objHasClass( window.inlinePopupWindowObjPointers[idx].wrapper, "mceMinimized" ) )
              {
                  offsetArray.push( getObjPosition(window.inlinePopupWindowObjPointers[idx].wrapper).x );
              }
          }          
          offsetArray.sort();
          
          var leftOffset = scrollPos.x;
          for( var idx = 0; idx < offsetArray.length; ++idx )
          {
              if( (leftOffset >= offsetArray[idx] && leftOffset < offsetArray[idx] + minWidth ) ||
                  (leftOffset + minWidth >= offsetArray[idx] && leftOffset + minWidth < offsetArray[idx] + minWidth ) )
              {
                  leftOffset = offsetArray[idx] + minWidth + 1;
              }                      
          }
          
          popupDiv.style.left = ( leftOffset + scrollPos.x ) + "px";
          popupDiv.style.top = ( windowSize.height + scrollPos.y - minHeight  ) + "px";
      
          // TODO:
          // Now, set an onScroll event handler on the main window, so we can keep the window
          // at the bottom of the screen. When restored, this can be removed.
               
          
          // Set the class to update the display
          objAddClass(popupWrapper, "mceMinimized");
          objDeleteClass(popupWrapper, "mceResizable");
          objDeleteClass(popupWrapper, "mceMovable");
      }            
      
      this.maximize = function()
      {
          // Get the old location and size.
          var offsets= getObjPosition(popupDiv);
          that.oldX = offsets.x;
          that.oldY = offsets.y;
          that.oldWidth = parseInt(getStyle(popupDiv,'width'));
          that.oldHeight = parseInt(getStyle(popupDiv,'height'));

          // Get the bounds that we can expand the window to.
          var windowSize = getWindowSize();
          var scrollPos = getScrollPosn();                                                           
          var newTop = scrollPos.y;
          var newLeft = scrollPos.x;
          var newWidth = windowSize.width;
          var newHeight =  windowSize.height;
          
          // TODO: check the set bounds (minTop, maxTop, etc. and use them if set)          
          popupDiv.style.left = newLeft;
          popupDiv.style.top = newTop;

          popupDiv.style.height = newHeight + "px";
          mce_detailcontent.style.height = ( newHeight - 29 ) + "px";
          dragCover.style.height = ( newHeight - 8) + "px";
          
          popupDiv.style.width = newWidth + "px";
          mce_detailcontent.style.width = ( newWidth  - 10 ) + "px";
          dragCover.style.width = ( newWidth - 8 ) + "px";

          if( null != that.contentResizeHndlr )
          {
              that.contentResizeHndlr(newWidth - 10, newHeight - 29);
          }
                    
          // Set the class to update the display
          objAddClass(popupWrapper, "mceMaximized");
          objDeleteClass(popupWrapper, "mceResizable");
          objDeleteClass(popupWrapper, "mceMovable");          
      }
      
      this.restore = function( )
      {
          popupDiv.style.left = that.oldX + "px";
          popupDiv.style.top = that.oldY + "px";
          
          popupDiv.style.height = that.oldHeight + "px";
          mce_detailcontent.style.height = ( that.oldHeight - 29 ) + "px";
          dragCover.style.height = ( that.oldHeight - 8) + "px";
          
          popupDiv.style.width = that.oldWidth + "px";
          mce_detailcontent.style.width = ( that.oldWidth  - 10 ) + "px";
          dragCover.style.width = ( that.oldWidth - 8 ) + "px";
          
          if( null != that.contentResizeHndlr )
          {
              that.contentResizeHndlr( that.oldWidth - 10, that.oldHeight - 29);
          }

          objDeleteClass( popupWrapper, "mceMaximized")
          objDeleteClass( popupWrapper, "mceMinimized")
          objAddClass(popupWrapper, "mceResizable");
          objAddClass(popupWrapper, "mceMovable");
      }
      
      this.setBounds = function( left, top, right, bottom )
      {
          that.minLeft = left;
          that.minTop = top;
          that.maxLeft = right;
          that.maxTop = bottom;      
      }
      
      this.onResize = function( item )
      {
          that.contentResizeHndlr = item;
      }
            
      this.onClose= function( item )
      {
          that.closeHandler = item;
      }
            
      //
      // Set the event handlers. All of these will be active, but only the ones
      // allowed by the options (classNames) will actually be able to be acted upon.
      //      
      setEventHandler( popupDiv, "onmousedown", this.focus );
      setEventHandler( mce_move, "onmousedown", this.startMove );
      setEventHandler( mce_min, "onclick", this.minimize );
      setEventHandler( mce_max, "onclick", this.maximize );
      setEventHandler( mce_med, "onclick", this.restore );
      setEventHandler( mce_close, "onclick", this.close );
      setEventHandler( mce_res_n, "onmousedown", this.startResize );
      setEventHandler( mce_res_s, "onmousedown", this.startResize );
      setEventHandler( mce_res_e, "onmousedown", this.startResize );
      setEventHandler( mce_res_w, "onmousedown", this.startResize );
      setEventHandler( mce_res_ne, "onmousedown", this.startResize );
      setEventHandler( mce_res_nw, "onmousedown", this.startResize );
      setEventHandler( mce_res_se, "onmousedown", this.startResize );
      setEventHandler( mce_res_sw, "onmousedown", this.startResize );
      
      this.focus();
  }
 
  //
  // Public utility funcions: Hopefully these will be useful elsewhere as well...
  //
  
  function objHasClass( obj, className )
  {
      var found = false;
      if( obj )
      {
          var classNameList = obj.className.split(' ');
          for( var idx = 0; idx < classNameList.length; ++idx)
          {
              if( classNameList[idx] == className )
              {
                  found = true;
                  break;
              }
          }
      }
      return found;
  }
  
  function hasClass( id, className )
  {
      var item = document.getElementById( id );

      return objHasClass(item, className);
  }
  
  function objAddClass( obj, className )
  {
      if( obj )
      {
          if( false == objHasClass(obj, className) )
          {
              obj.className += (" " + className);
          }
      }  
  }
  
  function addClass( id, className )
  {
      objAddClass( document.getElementById( id ) );
  }
  
  function objDeleteClass( obj, className )
  {
      if( obj )
      {
          var classNameList = obj.className.split(' ');
          for( var idx = 0; idx < classNameList.length; ++idx)
          {
              if( classNameList[idx] == className )
              {
                  classNameList.splice(idx,1);
              }
          }
          
      }
      
      obj.className = classNameList.join(' ');  
  }
  
  function deleteClass( id, className )
  {
      objDeleteClass( document.getElementById( id ) );
  }
  
  var attachedEventHandlers = new Array;
  
  function setEventHandler( object, eventName, fnction )
  {
      var functionCallObj = function(e) { return eventHandlerBaseFn( e, fnction ); };
      if( object.attachEvent )
      {
          object.attachEvent(eventName, functionCallObj );
      }
      else
      {
          eventName = eventName.substring(2,eventName.length).toLowerCase();
      
          object.addEventListener(eventName, functionCallObj, false);
      }  
      
      attachedEventHandlers.push( { obj: object, evt: eventName, func: functionCallObj } );
      
  }
  
  function removeEventHandler( object, eventName )
  {
      var mozEventName = eventName.substring(2,eventName.length).toLowerCase();

      for( var idx = 0; idx < attachedEventHandlers.length; ++idx )
      {
          if( object == attachedEventHandlers[idx].obj && 
              ( eventName == attachedEventHandlers[idx].evt || mozEventName == attachedEventHandlers[idx].evt ) )
          {
              if( object.removeEventListener )
              {
                  object.removeEventListener( attachedEventHandlers[idx].evt, attachedEventHandlers[idx].func, false );
              }
              else
              { 
                  object.detachEvent( attachedEventHandlers[idx].evt, attachedEventHandlers[idx].func );
              }
              attachedEventHandlers.splice(idx,1);
          }
      }
  }
  
  function eventHandlerBaseFn( e, fnction )
  {
      e = (e) ? e : ((window.event) ? window.event : null)
      
      return fnction(e);
  }  

  function getStyle(el,styleProp)
  { 
	  if (el.currentStyle)
		  var y = el.currentStyle[styleProp];
	  else if (window.getComputedStyle)
	      var y = document.defaultView.getComputedStyle(el,null).getPropertyValue(styleProp);
  	  return y;
  }

  Number.prototype.NaN0=function(){return isNaN(this)?0:this;}

  function getObjPosition(obj) 
  {
      var curleft = 0;
      var curtop = 0;
      if (obj.offsetParent) 
      {
          do 
          {
	          curleft += obj.offsetLeft;
			  curtop += obj.offsetTop;
			  
			  if( obj.tagName.toLowerCase() != "body" && obj.scrollTop && parseInt(obj.scrollTop).NaN0() > 0 )
			      curtop += parseInt(obj.scrollTop);
	      } 
	      while (obj = obj.offsetParent);
	  }
	  return {x:curleft,y:curtop};	  
  } 
  
  function mouseCoords(ev)
  {
	  if(ev.pageX || ev.pageY)
	  {
	      return {x:ev.pageX, y:ev.pageY};
	  }
	  
	  return { x:ev.clientX + document.body.scrollLeft - document.body.clientLeft,
		        y:ev.clientY + document.body.scrollTop  - document.body.clientTop };
  }
  
  function getWindowSize()
  {
      if( typeof( window.innerWidth ) == 'number' ) 
      {
          //Non-IE
          myWidth = window.innerWidth;
          myHeight = window.innerHeight;
      } 
      else if( document.documentElement && 
               ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) 
      {
          //IE 6+ in 'standards compliant mode'
          myWidth = document.documentElement.clientWidth;
          myHeight = document.documentElement.clientHeight;
      } 
      else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) 
      {
          //IE 4 compatible
          myWidth = document.body.clientWidth;
          myHeight = document.body.clientHeight;
      }
      
      return { width:myWidth, height:myHeight };
  }

  function getScrollPosn() 
  {
      var scrOllX = 0; 
      var scrOllY = 0;

      if( typeof( window.pageYOffset ) == 'number' ) 
      {
          //Netscape compliant
          scrOllY = window.pageYOffset;
          scrOllX = window.pageXOffset;
      } 
      else if( document.body && 
               ( document.body.scrollLeft || document.body.scrollTop ) ) 
      {
          //DOM compliant
          scrOllY = document.body.scrollTop;
          scrOllX = document.body.scrollLeft;
      } 
      else if( document.documentElement && 
               ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) 
      {
          //IE6 standards compliant mode
          scrOllY = document.documentElement.scrollTop;
          scrOllX = document.documentElement.scrollLeft;
      }

      return { x:scrOllX, y:scrOllY };
  }
  
  function getPopupScriptBase( scriptname )
  {
      var scriptObjs = document.getElementsByTagName("script");

      for( var idx = 0; idx < scriptObjs.length; ++idx )
      {
          if( scriptObjs[idx] && scriptObjs[idx].src && scriptObjs[idx].src.indexOf("inlinepopups.js") > -1 )
          {
              var index = scriptObjs[idx].src.indexOf("inlinepopups.js");
              var baseUrl = "";
                 
              // Get the relative URL of the script (from the script tag)
              // For Firefox and others, we get a full URL. in IE, we just get what's there...
              if( index > 0 )
              {
                  baseUrl = scriptObjs[idx].src.substring(0,index);
              }
                 
              // If we 
                 
              return baseUrl;
          }
      }      
  }
