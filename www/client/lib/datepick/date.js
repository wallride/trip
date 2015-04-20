var mess = js_osmp_date_mess;
Date.dayNames = mess['daynames'];
Date.abbrDayNames = mess['daynamesAbbr'];
Date.monthNames = mess['months'];
Date.abbrMonthNames = mess['monthsAbbr'];
Date.shortMonthNames = mess['monthsAbbr'];
Date.firstDayOfWeek = mess['firstday'];
Date.format = 'dd/mm/yyyy';
Date.fullYearStart = '20';

  function add(name, method) {
		if( !Date.prototype[name] ) {
			Date.prototype[name] = method;
		}
	};
	add("whatDayInWeek", function() {
       if (this.getDay()==0) return 7; 
       else return this.getDay();
    });
    
	add("isLeapYear", function() {
		var y = this.getFullYear();
		return (y%4==0 && y%100!=0) || y%400==0;
	});
    
	add("isWeekend", function() {
		return this.getDay()==0 || this.getDay()==6;
	});
	
	add("isWeekDay", function() {
		return !this.isWeekend();
	});
	
	add("getDaysInMonth", function(month) {
		return [31,(this.isLeapYear() ? 29:28),31,30,31,30,31,31,30,31,30,31][((typeof(month)!='undefined')?month:this.getMonth())];
	});

    add("getDaysInThatMonth", function(year) {
        leap=0;
        ((year%4==0 && year%100!=0) || year%400==0)?leap=1:leap=0;
        return [31,(leap ? 29:28),31,30,31,30,31,31,30,31,30,31][(this.getMonth())];
    });

	add("getDayName", function(abbreviated) {
		return abbreviated ? Date.abbrDayNames[this.getDay()] : Date.dayNames[this.getDay()];
	});

	add("getMonthName", function(abbreviated) {
		return abbreviated ? Date.abbrMonthNames[this.getMonth()] : Date.monthNames[this.getMonth()];
	});

	add("getDayOfYear", function() {
		var tmpdtm = new Date("1/1/" + this.getFullYear());
		return Math.floor((this.getTime() - tmpdtm.getTime()) / 86400000);
	});
	
	add("getWeekOfYear", function() {
		return Math.ceil(this.getDayOfYear() / 7);
	});

	add("setDayOfYear", function(day) {
		this.setMonth(0);
		this.setDate(day);
		return this;
	});
	
	add("addYears", function(num) {
		this.setFullYear(this.getFullYear() + num);
		return this;
	});
	
	add("addMonths", function(num) {
		var tmpdtm = this.getDate();
		
		this.setMonth(this.getMonth() + num);
		
		if (tmpdtm > this.getDate())
			this.addDays(-this.getDate());
		
		return this;
	});
	
	add("addDays", function(num) {
		//this.setDate(this.getDate() + num);
		this.setTime(this.getTime() + (num*86400000) );
		return this;
	});
	
	add("addHours", function(num) {
		this.setHours(this.getHours() + num);
		return this;
	});

	add("addMinutes", function(num) {
		this.setMinutes(this.getMinutes() + num);
		return this;
	});
	
	add("addSeconds", function(num) {
		this.setSeconds(this.getSeconds() + num);
		return this;
	});
	
	add("zeroTime", function() {
		this.setMilliseconds(0);
		this.setSeconds(0);
		this.setMinutes(0);
		this.setHours(0);
		return this;
	});
	
	add("asString", function(format) {
		var r = format || Date.format;
		return r
			.split('yyyy').join(this.getFullYear())
			.split('yy').join((this.getFullYear() + '').substring(2))
			.split('mmmm').join(this.getMonthName(false))
			.split('mmm').join(this.getMonthName(true))
			.split('mm').join(_zeroPad(this.getMonth()+1))
			.split('dd').join(_zeroPad(this.getDate()));
	});
	
	Date.fromString = function(s)
	{
		var f = Date.format;
		var d = new Date('01/01/1977');
		
		var mLength = 0;

		var iM = f.indexOf('mmmm');
		if (iM > -1) {
			for (var i=0; i<Date.monthNames.length; i++) {
				var mStr = s.substr(iM, Date.monthNames[i].length);
				if (Date.monthNames[i] == mStr) {
					mLength = Date.monthNames[i].length - 4;
					break;
				}
			}
			d.setMonth(i);
		} else {
			iM = f.indexOf('mmm');
			if (iM > -1) {
				var mStr = s.substr(iM, 3);
				for (var i=0; i<Date.abbrMonthNames.length; i++) {
					if (Date.abbrMonthNames[i] == mStr) break;
				}
				d.setMonth(i);
			} else {
				d.setMonth(Number(s.substr(f.indexOf('mm'), 2)) - 1);
			}
		}
		
		var iY = f.indexOf('yyyy');

		if (iY > -1) {
			if (iM < iY)
			{
				iY += mLength;
			}
			d.setFullYear(Number(s.substr(iY, 4)));
		} else {
			if (iM < iY)
			{
				iY += mLength;
			}
			// TODO - this doesn't work very well - are there any rules for what is meant by a two digit year?
			d.setFullYear(Number(Date.fullYearStart + s.substr(f.indexOf('yy'), 2)));
		}
		var iD = f.indexOf('dd');
		if (iM < iD)
		{
			iD += mLength;
		}
		d.setDate(Number(s.substr(iD, 2)));
		if (isNaN(d.getTime())) {
			return false;
		}
		return d;
	};
	
	// utility method
	var _zeroPad = function(num) {
		var s = '0'+num;
		return s.substring(s.length-2)
		//return ('0'+num).substring(-2); // doesn't work on IE :(
	};
	
	Date.prototype.strMonth =  function(num) {
    var i=0;
    if (typeof num == 'undefined')
      return Date.monthNames[this.getMonth()];
    else if (num<0) return Date.shortMonthNames[this.getMonth()];
    else 
      for (i=0;i<12;i++)
        if (Date.monthNames[i] == num  || Date.abbrMonthNames[i] == num || Date.shortMonthNames[i] == num || i == num) return this.setMonth(i);
    return false;
  }
  
  Date.prototype.getFormat = function(formatString)
  {
      var time={};
    time.Y = this.getFullYear();
    if (isNaN(time.Y)) return false;
  	time.y = time.Y.toString().substring(2);
  	time.n = this.getMonth() + 1;
  	time.m = time.n < 10 ? "0" + time.n : time.n;
  	time.j = this.getDate();
  	time.d = time.j < 10 ? "0" + time.j : time.j;
  	time.H = this.getHours();
  	time.H = time.H < 10 ? "0" + time.H : time.H;
  	time.i = this.getMinutes();
  	time.i = time.i < 10 ? "0" + time.i : time.i;
  	time.s = this.getSeconds();
  	time.s = time.s < 10 ? "0" + time.s : time.s;
  	formatString = formatString.replace('Y', time.Y);
  	formatString = formatString.replace('y', time.y);
  	formatString = formatString.replace('d', time.d);
  	formatString = formatString.replace('j', time.j);
  	formatString = formatString.replace('H', time.H);
  	formatString = formatString.replace('i', time.i);
  	formatString = formatString.replace('s', time.s);
    formatString = formatString.replace('M', this.strMonth());
    //formatString = formatString.replace('n', this.strMonth(-1));
    formatString = formatString.replace('m', time.m);
    formatString = formatString.replace('n', time.n);
    formatString = formatString.replace('raw', this);
  	return formatString;
  }
  
  Date.prototype.setFormat = function(formatDate, formatString)
  {
    var i=0;
    var re = /[-: ,.\/]/;
    var time = {};
    
    if (typeof formatDate=='object') {
      formatDate=new Date(formatDate+'');  
      formatDate = formatDate.getFormat(formatString);
    }

    var fDate = formatDate.split(re);
    var fString = formatString.split(re);
    if (fDate.length!=fString.length) {this.setSeconds('Invalid Date'); return this;}
    
    for (i=0;i<fDate.length;i++) {
			if (fDate[i])
				while (fDate[i].length>1 && fDate[i].substr(0,1)=='0') 
					fDate[i]=fDate[i].substr(1,1);
      if (parseInt(fDate[i],10)>=0 && parseInt(fDate[i],10)==fDate[i]) 
        time[fString[i]]=parseInt(fDate[i],10);
        else {
          this.setSeconds('Invalid Date'); 
          return this;
        }
    }
    
    if ("y" in time && (time.y>40)) {this.setSeconds('Invalid Date'); return this;}
    if ("Y" in time && (time.Y<1980 || time.Y>2040)) {this.setSeconds('Invalid Date'); return this;}
    if ("m" in time && (time.m<1 || time.m>12)) {this.setSeconds('Invalid Date'); return this;}
    if ("H" in time && (time.H<0 || time.H>23)) {this.setSeconds('Invalid Date'); return this;}
    if ("i" in time && (time.i<0 || time.i>60)) {this.setSeconds('Invalid Date'); return this;}
    if ("s" in time && (time.s<0 || time.s>60)) {this.setSeconds('Invalid Date'); return this;}
    
    if ("M" in time) this.strMonth(time.M);
    if ("m" in time) {if (this.getDaysInMonth(time.m-1)<this.getDate()) this.setDate(1); this.setMonth(time.m-1);}
    if ("n" in time) this.setMonth(time.n-1);
    if ("d" in time && (time.d<1 || time.d>this.getDaysInThatMonth(time.Y))) {this.setSeconds('Invalid Date'); return this;} 
    if ("Y" in time) this.setFullYear(time.Y);
    if ("d" in time) this.setDate(time.d);
    if ("j" in time) this.setDate(time.j);
    if ("y" in time) this.setYear(time.y);
    if ("H" in time) this.setHours(time.H);
    if ("i" in time) this.setMinutes(time.i);
    if ("s" in time) this.setSeconds(time.s);
    return this;  
  }
  
  Date.prototype.setInterval = function(val){ 
    val = parseInt(val,10);
    var time=[new Date(this+''),new Date(this+'').setFormat('23:59:59','H:i:s')];
    if (val == 'NaN') return time;    
    switch(val)
    {
      case 0:
        time[0].addHours(-1);
        break;
      case 1:
        break;
      case 2:
        time[0].addDays(-1);
        time[1].addDays(-1);
        break;
      case 3:
        time[0].addDays(-6);
        break;
      case 9:
        time[0].addDays(-29);
        break;
      case 4:
        time[0].setDate(1);
        break;
      case 5:
        time[1].setDate(1);
        time[1].addDays(-1);
        time[0].addMonths(-1).setDate(1);
        break;
      case 6:      
        time[0].addDays(-time[0].whatDayInWeek()+1);
        //time[0].addDays(-time[0].getDay()+1);
        break;
      case 7:
        time[1].addDays(-time[1].whatDayInWeek());
        time[0].addDays(-7-time[0].whatDayInWeek()+1);
        //time[1].addDays(-time[1].getDay());
        //time[0].addDays(-7-time[0].getDay()+1);
        break;
      case 8:
        time[0].setDate(1);
        time[0].setMonth(0);
        break;
      case 10:
        time[0].addHours(-1);
        time[1]=new Date(this+'');
        break;        
      default:
        return false;
    }
    if (val!=10)
        time[0]=time[0].zeroTime();
    return time;
  }
  
  Date.prototype.valid = function(){
     return (this!='Invalid Date' && !isNaN(this))
  }
  
