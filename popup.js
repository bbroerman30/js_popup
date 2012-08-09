// Some global instances
var inlinePopup;

inlinePopup = {
	init : function() {

		// Find window & API
		this.win = this.getWin();
		
		this.frameId = window.frameElement.id;
		
		this.parameters = this.win.inlinePopupWindowParamsHolder[this.frameId];

		this.popupObj = this.getWindowArg('inline_popup_Obj'); 
		
    	this.isOpera = window.opera && opera.buildNumber;
	},
	
	getWin : function() {
		return opener || parent || top;
	},

	getWindowArg : function(n) {
		return this.parameters[n];
	},


	close : function() {
		var that = this;

		// To avoid domain relaxing issue in Opera
		function close() {
			that.popupObj.close();
			that.parameters = that.popupObj = null; // Cleanup
		};

		if (this.isOpera)
			this.getWin().setTimeout(close, 0);
		else
			close();
	}
};

inlinePopup.init();

