$.dpText = js_osmp_datepicker_mess;
arrDatepickers = {};

function hasElemMas(mas, new_element){
    var found = false, key;
    for (key in mas) {
        if (mas[key] == new_element) {
            found = true;
            break;
        }                
    }
    if (!found) return [false, 0];
    else return [true, key];
}

function revertMasDate(mas){
    masdate = mas.split("; ");
    var endmas = [];
    for(k in masdate){
        var masoffset = [];
        var textoff='';
        masoffset = masoffset.reverse(masdate[k].split("."));
        foreach(k_off in masoffset)
            if (masoffset[k_off]) textoff += masoffset[k_off]+"-";                 
        endmas.push(textoff);
    }
    return endmas;
}

jQuery.fn.datePick = function(options) {
	if ($(this).attr('id'))
		if (arrDatepickers[$(this).attr('id')])
			return arrDatepickers[$(this).attr('id')];
	var items = $(this);
	var dp=0;
	var res;
	for (dp=0;dp<items.length;dp++)
		res = $(items[dp]).datePickBind(options);
	return res;
}

jQuery.fn.datePickBind = function(options) {

	this._defaults = {
		time: true, //if true, there will be time selectors
		startDate: '01/01/1980', // if 'today', sets new Date()
		endDate: '01/01/2040', // if 'today', sets new Date()
		months: 2,
		setToday:true, //sets today if input was empty
		dateOffset:0, //adds seconds to hidden data
        selectMultiple:false //select multiple dates
	};
	var mess = js_osmp_datedialog_mess;
	var opts = $.extend(this._defaults, options);
	this.opts = opts;

	var i=0;
    var multy_mas = [];
	var vars = {
		object: this,
		input: $(this),
		item:$(this),
		format: ((opts.time)?mess.dateTimeFormat:mess.dateFormat),
		date: new Date(),
		lastDate:false,
		trackbar:false,
		dpFormat:'d.m.Y',
		onSet:[],
		doOnce:false,
		lang:mess.curLang,
		storeFormat:'Y-m-d H:i:s'
	};
	this.vars = vars;
	
	if (vars.input.length!=1) return false;
	
	if (opts.startDate=='today')
		{opts.startDateVal = new Date().zeroTime(); opts.startDate=opts.startDateVal.getFormat(vars.dpFormat);}
		else opts.startDateVal = new Date().setFormat(opts.startDate,vars.dpFormat).zeroTime();
	if (opts.endDate=='today')
		{opts.endDateVal = new Date().addDays(10).zeroTime(); opts.endDate=opts.endDateVal.getFormat(vars.dpFormat);}
		else opts.endDateVal = new Date().setFormat(opts.endDate,vars.dpFormat).addDays(1).zeroTime();

	//creating dialog
	var code = "<div class='date-container'>"
	+ "<span class='showinput' style=' '>&nbsp;</span>"
	+ "<div class='showpickers'>"
	+ "</div>"
	+ "<div class='showtime'>"
	+ "</div>"
	+ "<input type='button' class='save_date'><input type='button' class='close_date'>"
	+ "</div>";

	//remember elements for fast access
	vars.input.addClass('datepicker');
	if (opts.setToday && !vars.input.val()) {
		vars.input.val(vars.date.getFormat(vars.format));
	} else {
		vars.date = vars.date.setFormat(vars.input.val(),vars.storeFormat);
		vars.input.val(vars.date.getFormat(vars.format));
		
	}
	
	vars.input.attr('title',mess.inputalt.replace('%s',vars.format));
	vars.input.before(code);
	vars.dialog = vars.input.prev();
	
	$(document).ready(function(){
		vars.dialog.appendTo($(document.body));
		vars.dialog = $(document.body).children('.date-container:last');
	});
	
	vars.input.after("<input type='button' class='datebutton' />");
	vars.button = vars.input.next();
	
	vars.input.after('<input type="hidden" name="'+vars.input.attr('name')+'" />');
	vars.store = vars.input.next();
	if (vars.input.is('.date'))
		vars.store.addClass('cont-date');
		else {
            if (vars.input.is('.multydate'))
                vars.store.addClass('cont-date');
            else
                vars.store.addClass('cont-datetime');
        }
	vars.input.attr('name',vars.input.attr('name')+'_shown');
	vars.store.val(vars.date.addSeconds(opts.dateOffset).getFormat(vars.storeFormat));
	
	vars.calCont = vars.dialog.find('.showpickers');
	vars.timeCont = vars.dialog.find('.showtime');
	vars.title = vars.dialog.find('.showinput');
	vars.saveButton = vars.dialog.find('.save_date');
	vars.closeButton = vars.dialog.find('.close_date');
	
	vars.dialog.bgIframe();
	
	if (!vars.input.is('.fullrow')) {
		//vars.dialog.css('left',vars.input.offset().left+'px');
		//vars.dialog.css('top',vars.input.offset().top+'px');
	}
	
	vars.input.blur(function(){
		vars.object.setDate();
	});
	
	//bind functions to every calendar

	var text = '<table><tr>';
	for (i=0;i<opts.months;i++) text+='<td><div class="calendar" number="'+i+'"></div></td>';
	vars.calCont.append(text+'</tr></table>');
	for (i=0;i<opts.months;i++) {
		vars.calCont.find('.calendar[number='+i+']')
			.datePicker({selectMultiple:opts.selectMultiple, inline:true, month:1, startDate:opts.startDate, endDate:opts.endDate, renderCallback:function($td, thisDate, month, year) {if (thisDate.isWeekend()) {$td.addClass('weekend');} else {$td.addClass('weekday');}}})
			.bind('dpMonthChanged',function(event, displayedMonth, displayedYear){
				var cals = vars.calCont.find('.calendar');
				var thisNum = $(this).attr('number');
				for (cal=0;cal<cals.length;cal++) 

					$(cals[cal]).dpSetDisplayedMonth(displayedMonth+cal-thisNum, displayedYear);
			})
			.bind('dateSelected',function(event, date, $td, status){
				var thisNum = $(this).attr('number');
                vars.calCont.find('.calendar').dpSetSelected(date.asString(), status, false);
				if (thisNum==0) {
					vars.date.setFormat(date.asString(),vars.dpFormat);
                    updateDate();
				}
			});
		if (i!=0) vars.calCont.find('.calendar[number='+i+']').find('.dp-nav-prev-month').remove();
		if (i!=opts.months-1) vars.calCont.find('.calendar[number='+i+']').find('.dp-nav-next-month').remove();
	}

	
	//creating trackbar
	if (opts.time) {
		counter = 0;
		while ($('#dateSlider'+counter).length) counter++;
		var id = 'dateSlider'+counter;
		vars.timeCont.append("<div id='dateSlider"+counter+"' style='width:120px; height:60px;'></div>");
		
		$(document).ready(function() { 
			fctrackbar.getObject(id+'bar').init({}, id); //small fix
			fctrackbar.getObject(id+'bar').init({
				dual : false,
				width : 270,
				rightLimit : 1439,
				showSmallTicks : true,
				showBigTicks : true,
				bigTicks : 23
			},
			id);
		});
		vars.trackbar = fctrackbar.getObject(id+'bar');
		vars.trackbar.onMove = function(){
			var val = this.leftValue;
			vars.date.setHours(Math.floor(val/60));
			vars.date.setMinutes(val%60);
			vars.date.setSeconds(60.0/1440*val);
			updateDate();
		};
		
	} else vars.timeCont.append("<div>&nbsp;</div>"); //vars.timeCont.remove();
	
	
	//bind function to show/hide dialog
	vars.button.click(function(){
		if (vars.input.attr('readonly')) 
			return false;
		var date = new Date().setFormat(vars.input.val(), vars.format);
		if (!date.valid()) date = new Date();
		openDialog(date);
	});
	
	//close dialog without saving on document click  --------------------------------------------------------------------
	/*$(document).click(function(){
		if (vars.dialog.attr("clicked")!="true") {
			vars.lastDate=false;
			vars.dialog.hide();
		}
		vars.dialog.attr("clicked","false");
	});*/
	
	//handling Enter (save) and Esc (cancel) buttons
	$(document).keydown(function(e) {
		if (vars.dialog.is('visible')) {		 
			var var_key = e.keyCode || e.which;
			if (var_key && (var_key == 13)){
				vars.saveButton.click();}
			if (var_key && (var_key == 27))
				vars.closeButton.click();
		}
	}); 
	
	//don't close dialog if we click on it
	vars.dialog.click(function(){
		vars.dialog.attr("clicked","true");
	});
	
	//catcheng last selected day and close dialog if we click it twice 
	vars.calCont.click(function(e){
        if (opts.selectMultiple){
            var selected = $(e.target);
            if (selected.is('.disabled')) return false;
            var title = selected.parents('.calendar:first').find('h2:first').text()+' - '+selected.text();
            
            var new_elem = selected.text()+'.'+((selected.parents('.calendar:first').find('.hid').val().toString().length)>6?selected.parents('.calendar:first').find('.hid').val():'0'+selected.parents('.calendar:first').find('.hid').val());
            var hasElem = [];
            hasElem = hasElemMas(multy_mas, new_elem);
            if (selected.hasClass('selected')) {
                if (!hasElem[0]) multy_mas.push(new_elem);
            }
            else {
                if (hasElem[0]) multy_mas.splice(hasElem[1],1);
            }
        }
        else {
		    var selected = $(e.target);
		    if (selected.is('.disabled')) return false;
	        var title = selected.parents('.calendar:first').find('h2:first').text()+' - '+selected.text();
		    if (vars.lastDate == title) vars.saveButton.click();
		    vars.lastDate = title;
        }
	});
	
	//set up all data elements
	var openDialog = function(date){
        vars.calCont.find('.selected').removeClass('selected');
		vars.date = date;
        vars.title.text(date.getFormat(vars.format));

		var cals = vars.calCont.find('.calendar');
		for (i=0;i<cals.length;i++) {
			var thisNum = $(cals[i]).attr('number');
			var thisMonth = date.getMonth()-opts.months+parseInt(thisNum,10)+1;
			if (date.getFullYear()*12+date.getMonth()<=opts.startDateVal.getFullYear()*12+opts.startDateVal.getMonth())
		        thisMonth += 1;
            if(opts.selectMultiple)
                $(cals[i]).dpSetDisplayedMonth(1,date.getFullYear()-1).dpSetDisplayedMonth(thisMonth,date.getFullYear());
            else
			    $(cals[i])
				    .dpSetDisplayedMonth(1,date.getFullYear()-1)
				    .dpSetDisplayedMonth(thisMonth,date.getFullYear())
				    .dpSetSelected(date.asString());
		}
		
		if (vars.trackbar)
			vars.trackbar.updateLeftValue(parseInt(date.getHours()*60,10) + parseInt(date.getMinutes(),10));
		
		vars.dialog.css('top',vars.input.offset().top+'px');
		vars.dialog.css('left',vars.input.offset().left+'px');
		
		vars.dialog.animate({"opacity":"show","height":"toggle"});
		//vars.dialog.css('width', vars.dialog.outerWidth())
		vars.dialog.attr("clicked","true");
        
        multy_mas=[];
        var selected_items = vars.calCont.find('.selected').filter('.current-month').get();//выделенные в прошлый раз ячейки (если календарь на странице запцускается повторно)
        for (key in selected_items){            
            var text = selected_items[key].offsetParent.offsetParent.innerHTML;
            var real_month = text.substr(text.indexOf('class="hid"')+19,7);
            month_mas=[];
            month_mas = real_month.split(".");
            //if (real_month.indexOf('"')) {real_month = real_month.substr(0,real_month.length-1); /*!!!!коммент сделан в ноябре - длина месяца = 2!!!!*/            
            if (month_mas[0].length==1) real_month = real_month.substr(0,real_month.length-1);
            first_elem = selected_items[key].innerHTML+'.'+((real_month.toString().length>6)?real_month:'0'+real_month);
            multy_mas.push(first_elem); 
        }
	}
	
	//updating title
	var updateDate = function() {
        vars.title.text(vars.date.getFormat(vars.format)); ///***trouble*****
	}
	
	//saving changes
	vars.saveButton
		.val(mess.save)
		.click(function(){
			vars.dialog.hide();
            if (opts.selectMultiple) {
                var textmas="";
                for (var key_mas in multy_mas)
                    textmas += multy_mas[key_mas]+"; ";
                vars.input.val(textmas);
            }
            else
			    vars.input.val(vars.title.text());
			vars.input.focus().blur();
			vars.object.onSet();
		});
	
	//closing dialog
	vars.closeButton
		.val(mess.close)
		.click(function(){
			vars.lastDate=false;
			vars.dialog.hide();
		});
		
	this.onSet = function(f) {
		if (f=='unbind') {
			vars.onSet=[];
			return this;
		}
		else if (typeof(f)=='function') {
			vars.onSet.push(f);
			return this;
		}
		for (var i in vars.onSet)
			vars.onSet[i](vars.object);
		return this;
	}
	
	this.setDate = function(date,skip) {
		if (date==="" || (typeof(date)=='undefined' && vars.input.val()==="")){
			vars.input.val('').change();
			vars.store.val('').change();
			if (!skip) this.onSet(); 
			return this;
		} 
		if (!date) date = new Date().setFormat(vars.input.val(),vars.format);
		var offsetDate = new Date(date);
		offsetDate.addSeconds(opts.dateOffset);
		if (vars.store.val()===offsetDate.getFormat(vars.storeFormat)){
			vars.input.val(date.getFormat(vars.format));
			vars.store.val(offsetDate.getFormat(vars.storeFormat));
			return this;
		}
		if (date.valid()) {
            if (opts.selectMultiple) {
                var textmas="", textoffset='';
                for (var key_mas in multy_mas)
                    textmas += multy_mas[key_mas]+"; ";
                var offset_mas = revertMasDate(multy_mas);
                for (var key_off in offset_mas)
                    textoffset += offset_mas[key_off];
                vars.input.val(textmas);
                vars.store.val(textoffset);
            }
            else {
                vars.input.val(date.getFormat(vars.format));
			    vars.store.val(offsetDate.getFormat(vars.storeFormat));
            }
		    vars.input.change();
		    vars.store.change();
		}
		if (!skip) this.onSet(); 
		return this;
	}
	
	this.setDateOffset = function(sec){
		opts.dateOffset = sec;
		this.setDate(this.getDate().addSeconds(-sec), true);
	}

	this.isValid = function(date) {
		if (!date) date = this.getDate();
		if (!date.valid()) return false;
		if (date>opts.endDateVal) return false;
		if (date<opts.startDateVal) return false;
		return true;
	}
	
	this.getDate = function() {
		var a = new Date(); 
		return a.setFormat(vars.input.val(),vars.format);
	}
	
	this.bindPeriod = function(datefrom,period,label, selector){
		var dateto = vars.object;
		if (!selector) selector = $('#template');
		dateto.opts.endDate = 'today';
		datefrom.opts.endDate = 'today';
		if (!label) {
			vars.button.after('<label class="error"></label>');
			label = vars.button.next();
			label.hide();
		}
		
		if (dateto.opts.time) {
			dateto.setDateOffset(1);
		}

		if (datefrom.opts.time) {
			datefrom.vars.input.rules('add',{datetime:true});
			dateto.vars.input.rules('add',{datetime:true});
		}
		else {
			datefrom.vars.input.rules('add',{date:true});
			dateto.vars.input.rules('add',{date:true});
		}
		
		if (!period) period = false;
		
		var resetPeriod = function(){
			if (datefrom.opts.time)
				dateto.vars.input.addValidateFull("dateTimeRange",[datefrom.getDate(),period]);
				else dateto.vars.input.addValidateFull("dateRange",[datefrom.getDate(),period]);
			
			datefrom.vars.input.valid();
			dateto.vars.input.valid();
		}
		datefrom.onSet(resetPeriod);
		resetPeriod();
		
		var resetSelector = function(){
            if (selector.data()){
			    if (!selector.data().setVal)
				    selector.val("-1").change();
            }
		}
		datefrom.onSet(resetSelector)
		dateto.onSet(resetSelector)
		
		if (selector.length) {
			selector.change(function(){
				if (selector.data().reset)
					return true;
				var date = new Date();
				var val = $(this).val();
				date = date.setInterval(val);
				if (!date) return false;
				if (selector.data().setVal) return false;

				selector.data({setVal:true});
				dateto.setDate(date[1], true);
				datefrom.setDate(date[0], true);
				selector.val(val).change();
				selector.data({setVal:""});
				resetPeriod();
			});
		}
		return this;
	}
	arrDatepickers[vars.input.attr('id')] = this;
	return this;
};
