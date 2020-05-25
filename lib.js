var w = window, d = document;

(function(w) {
	
	"use strict"

	/**
	 * WrapperDOM class for working in DOM
	 * 
	 * @param selector (DOM or string)
	 * @param context for selector 
	 * @return mixed
	 */
 
	function WrapperDOM(selector, context) {

		this.selector = selector;
		this.context  = context ? context : w.d;
		
	};
	
	WrapperDOM.prototype = {
		
		insertBefore: function(target) {
			if (target.nodeType !== 1)
				target = this.context.querySelector(target);
			return target.parentNode.
				insertBefore(this.selector, target) && this.selector;
		},
		
		insertAfter: function(target) {
			if (target.nodeType !== 1)
				target = this.context.querySelector(target);		
			return target.parentNode.insertBefore(this.selector, 
				target.nextElementSibling) && this.selector;
		},
		
		remove: function() {
			if (!this.selector.nodeType)
				return this.listProcess("remove", arguments);
			this.selector.parentNode.removeChild(this.selector);
		},
		
		prev: function() {
			if (!this.selector.nodeType)
				this.selector = this.context.querySelector(this.selector);
			return this.selector.previousElementSibling;
		},
		
		next: function() {
			if (!this.selector.nodeType)
				this.selector = this.context.querySelector(this.selector);
			return this.selector.nextElementSibling;
		},
		
		index: function() {
			return Array.prototype.indexOf.call(this.selector.parentNode.children, this.selector);
		},
		
		width: function() {
			if (!this.selector.nodeType)
				this.selector = this.context.querySelector(this.selector);
			var computedStyle = getComputedStyle(this.selector);
			return this.selector.clientWidth - 
				(parseFloat(computedStyle.paddingLeft) + 
				 parseFloat(computedStyle.paddingRight));
		},
		
		height: function() {
			if (!this.selector.nodeType)
				this.selector = this.context.querySelector(this.selector);
			var computedStyle = getComputedStyle(selector);
			return this.selector.clientHeight - 
				(parseFloat(computedStyle.paddingTop) + 
				 parseFloat(computedStyle.paddingBottom));
		},
		
		data: function(object, ttl) {				                        // ttl - time to live		
			if (object) {                                                   // set data
				var k, v = this.selector.nodeStorage ? this.selector.nodeStorage : {};
				for (k in object)
					v[k] = object[k];
				this.selector.nodeStorage = v;
				if (ttl) this.selector.Timer = setTimeout((function(self) { // ttl remove data
					delete(self.selector.nodeStorage) && 
						delete(self.selector.Timer); })(this), ttl);			
			} else if (object === false)                                    // remove data
				return delete(this.selector.nodeStorage); 
			else return this.selector.nodeStorage;                          // get data
		},
		
		listProcess: function(name, args) {
			if (typeof this.selector == "string")
				this.selector = this.context.querySelectorAll(this.selector);				
			return [].forEach.call(this.selector, function(node) {
				return $(node)[name].apply($(node), args);
			}), this.selector;
		},
		
		addClass: function(token) {
			if (!this.selector.nodeType)
				return this.listProcess("addClass", arguments);
			if (!this.selector.classList.contains(token))
				return this.selector.className += 
					this.selector.className == null ? token : " " + token;
		},

		removeClass: function(token) {
			if (!this.selector.nodeType)
				return this.listProcess("removeClass", arguments);
			return this.selector.className = this.selector.className.
				replace(new RegExp(token + " | " + token), "");
		},
		
		hasClass: function(token) {
			return (' ' + this.selector.className + ' ').indexOf(' ' + token + ' ') > -1;
		},
		
		css: function(mixed, value) {
			if (!this.selector.nodeType)
				return this.listProcess("css", arguments);		
			if (typeof mixed == "string")
				this.selector.style[mixed] = value;
			else	
				for(var k in mixed)
					this.selector.style[k] = mixed[k];
			return this.selector;
		},
		
		on: function(events, handler, options) {			
			if (!this.selector.nodeType)
				return this.listProcess("on", arguments);
			var k, names = events.split(" ");			
			for (k in names)
				this.selector.addEventListener(names[k], handler, 
					options ? options : false);
			return this.selector;
		},
		
		off: function(events, handler, options) {
			if (events != undefined && handler != undefined) {
				if (!this.selector.nodeType)
					return this.listProcess("off", arguments);
				var k, names = events.split(" ");			
				for (k in names)
					this.selector.removeEventListener(names[k], handler, 
						options ? options : false);
				return this.selector;
			} else { // clear all events (and childs also)
				var node = this.selector.cloneNode(true);
				$(node).insertBefore(this.selector);
				$(this.selector).remove();
				return node;
			}
		},
		
		scrollTo: function(px, padding) {
			if (!this.selector.nodeType)
				this.selector = this.context.querySelector(this.selector);			
			var box    = this.selector.getBoundingClientRect(),
				pos    = Math.round(box.top + (w.pageYOffset || 
				d.documentElement.scrollTop || 
				d.body.scrollTop) - (d.documentElement.clientTop || 
				d.body.clientTop || 0)) - (padding ? padding : 0),
				i      = w.scrollY || w.screenTop;		
			if (i < pos) {
				setTimeout(function scrollMove() {
					w.scrollTo(0, i); i += px;
					if (i >= pos) { if (!padding) w.scrollTo(0, 0); }
					else setTimeout(scrollMove, 5);
				}, 5);
			} else { 
				setTimeout(function scrollMove() {
					w.scrollTo(0, i); i -= px;
					if (i <= pos) { if (!padding) w.scrollTo(0, 0); }
					else setTimeout(scrollMove, 5);
				}, 5);
			}
			return this.selector;		
		},
		
		attr: function(object) {
			if (!this.selector.nodeType)
				return this.listProcess("attr", arguments);
			var k;
			for (k in object)
				this.selector.setAttribute(k, object[k]);
			return $(this.selector);
		}
	};
	
	w.$ = function(selector, context) {
		return new WrapperDOM(selector, context);
	};
	
	w.$_ = function(tag, property) {		
		var k, t,
			t = d.createElement(tag);	
		if (!property) property = {};	
		if (Object.keys(property).length)
			for (k in property)
				t[k] = property[k];
		
		return t;
	};
	
	w.$.preload = [];


})(w);
