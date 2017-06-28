var cookie_key_all_units = 'ISH_DECK_PC_ALL_UNITS';
var cookie_key_main_units = 'ISH_DECK_PC_MIAN_UNITS_';
var cookie_key_main_units_list = 'ISH_DECK_PC_MIAN_UNITS_LIST';
var cookie_key_wishlist_view = 'ISH_DECK_PC_WISHLIST_VIEW';

var Common = (function () {
	var Common = function () {
	};
	var prot = Common.prototype;
	prot.addLog = function (text) {
		$('#exec-log').prepend('<p>[' + this.getTime() + '] ' + text + '</p>');
	};
	prot.getTime = function () {
		var d = new Date();
		var h = d.getHours();
		var m = d.getMinutes();
		var s = d.getSeconds();
		var ms = d.getMilliseconds();
		return h + ':' + m + ':' + s + '.' + ms;
	};
	prot.isArray = function (obj) {
		return Object.prototype.toString.call(obj) === '[object Array]';
	};
	return Common;
})();

var Deck = (function () {
	var Deck = function () {
		this.uhp1 = [0, 0, 0];
		this.uhp2 = [0, 0, 0];
		this.uhp3 = [0, 0, 0];
		this.uhp4 = [0, 0, 0];
		this.uhp5 = [0, 0, 0];
		this.total = 0;
	};
	var prot = Deck.prototype;
	prot.getForcesHpArray = function () {
		var ret = [];
		ret.push(this.uhp1);
		ret.push(this.uhp2);
		ret.push(this.uhp3);
		ret.push(this.uhp4);
		ret.push(this.uhp5);
		return ret;
	};
	prot.getUhpVariable = function (no) {
		var ret;
		switch (no) {
			case 1:
				ret = this.uhp1;
				break;
			case 2:
				ret = this.uhp2;
				break;
			case 3:
				ret = this.uhp3;
				break;
			case 4:
				ret = this.uhp4;
				break;
			case 5:
				ret = this.uhp5;
				break;
		}
		return ret;
	};
	prot.setUhpVariable = function (no, val) {
		switch (no) {
			case 1:
				this.uhp1 = val;
				break;
			case 2:
				this.uhp2 = val;
				break;
			case 3:
				this.uhp3 = val;
				break;
			case 4:
				this.uhp4 = val;
				break;
			case 5:
				this.uhp5 = val;
				break;
		}
		return;
	};
	prot.setDeckData = function () {
		var ttl = 0;
		for (var i = 1; i <= 5; i++) {
			var uhp = [];
			$('#deck-' + i + ' .unit').each(function (j) {
				uhp.push($(this).children('.hp').children('.val').html());
				ttl += Number($(this).children('.hp').children('.val').html());
			});
			this.setUhpVariable(i, uhp);
		}
		this.total = ttl;
	};
	prot.getUnitCount = function () {
		var ret = 0;
		for (var i = 1; i <= 5; i++) {
			$('#deck-' + i + ' .unit').each(function () {
				ret += 1;
			});
		}
		return ret;
	};
	prot.getForceUnitCount = function (no) {
		var ary = this.getUhpVariable(no);
		var ret = 0;
		for (var i = 0; i < 3; i++) {
			if (ary[i] != 0) {
				ret += 1;
			}
		}
		return ret;
	};
	prot.getLastForcesHp = function () {
		var ret = 0;
		for (var i = 5; i >= 1; i--) {
			var data = this.getUhpVariable(i);
			for (var j = 0, len = data.length; j < len; ++j) {
				ret += Number(data[j]);
			}
			if (ret > 0) {
				break;
			}
		}
		return ret;
	};
	prot.getForcesCount = function () {
		var ret = 0;
		for (var i = 1; i <= 5; i++) {
			var data = this.getUhpVariable(i);
			var temp = 0;
			for (var j = 0, len = data.length; j < len; ++j) {
				temp += Number(data[j]);
			}
			if (temp > 0) {
				ret += 1;
			}
		}
		return ret;
	};
	prot.getForcesCountAfter = function (now_hp) {
		if (now_hp <= 0) {
			return 0;
		}
		var ret = 0;
		var deck_hp = 0;
		for (var i = 1; i <= 5; i++) {
			var data = this.getUhpVariable(i);
			var temp = 0;
			for (var j = 0, len = data.length; j < len; ++j) {
				deck_hp += Number(data[j]);
				temp += Number(data[j]);
			}
			if (temp > 0) {
				ret += 1;
			}
			if (deck_hp > now_hp) {
				break;
			}
		}
		return ret;
	};
	prot.getUnitCountAfter = function (now_hp) {
		if (now_hp <= 0) {
			return 0;
		}
		var flg = false;
		var ret = 0;
		var deck_hp = 0;
		for (var i = 1; i <= 5; i++) {
			var data = this.getUhpVariable(i);
			for (var j = 0, len = data.length; j < len; ++j) {
				ret += 1;
				deck_hp += Number(data[j]);
				if (deck_hp > now_hp) {
					flg = true;
					break;
				}
			}
			if (flg) {
				break;
			}
		}
		return ret;
	};
	prot.getAdventUnitCountAfter = function (now_hp) {
		if (now_hp <= 0) {
			return 0;
		}
		var flg = false;
		var ret = 0;
		var deck_hp = 0;
		var ad_unit_hp = 0;
		var forces_hp = 0;
		var forces_units = 0;
		var ad_force = 0;
		for (var i = 1; i <= 5; i++) {
			var data = this.getUhpVariable(i);
			forces_hp = 0;
			forces_units = 0;
			ad_force = i;
			for (var j = 0, len = data.length; j < len; ++j) {
				ret += 1;
				forces_units += 1;
				deck_hp += Number(data[j]);
				forces_hp += Number(data[j]);
				if (deck_hp > now_hp) {
					flg = true;
					ad_unit_hp = data[j];
					break;
				}
			}
			if (flg) {
				break;
			}
		}
//		console.log(ret + '::' + now_hp + '::' + ad_force + '::' + ad_unit_hp + '::' + forces_hp + '::' + (now_hp - forces_hp));
//		console.log('----------------------------');
//		console.log('Now HP：' + now_hp);
		if (0 >= (now_hp - forces_hp)) {
			ret = 'タゲ：' + ad_force + '部隊(' + forces_units + 'ユニ)<br>合計出現：1部隊';
		} else {
			var down_hp = forces_hp;
			var ad_all_forces = 1;
			for (var i = ad_force - 1; i >= 0; i--) {
				ad_all_forces += 1;
//				console.log(i);
//				console.log(this.getUhpVariable(i));
				var tmp_ary = this.getUhpVariable(i);
				for (j = 0; j < tmp_ary.length; j++) {
					down_hp += Number(tmp_ary[j]);
				}
//				console.log('Total dmage：' + down_hp);
				if (now_hp < down_hp) {
					break;
				}
			}
			ret = 'タゲ：' + ad_force + '部隊(' + forces_units + 'ユニ)<br>合計出現：' + ad_all_forces + '部隊';
		}
		return ret;
	};
	return Deck;
})();

var Unit = (function () {
	var Unit = function (name, hp, key) {
		this.name = name;
		this.hp = hp;
		this.key = key;
	};
	var prot = Unit.prototype;
	prot.addUnitsSubArea = function (name, hp, key) {
		var unit_key = (key != '') ? key : Math.random().toString(36).slice(-6);
		$('#sub-unit-list').append('<li class="unit" data-key="' + unit_key + '"><p class="name">' + name + '</p><p class="hp">HP：<span class="val">' + hp + '</span></p><p class="edit"><a class="btn btn-info btn-sm edit-unit" href="#"><i class="fa fa-pencil"></i> Edit</a></p></li>');
		com_obj.addLog('unit「' + name + '/HP:' + hp + '」add');
	};
	prot.addUnitsDeck = function (name, hp, key, index) {
		$('#deck-' + index).append('<li class="unit" data-key="' + key + '"><p class="name">' + name + '</p><p class="hp">HP：<span class="val">' + hp + '</span></p><p class="edit"><a class="btn btn-info btn-sm edit-unit" href="#"><i class="fa fa-pencil"></i> Edit</a></p></li>');
		com_obj.addLog('forces' + index + ': unit「' + name + '/HP:' + hp + '(key:' + key + ')」add');
	};
	prot.deleteUnits = function () {
		$('.unit').remove();
	};
	prot.deleteSubUnits = function () {
		com_obj.addLog('Delete sub units');
		$('#sub-unit-list .unit').remove();
	};
	prot.deleteMainUnits = function () {
		com_obj.addLog('Delete main units');
		$('#main-unit-list .unit').remove();
	};
	prot.sortByDesc = function () {
		var units = cookie.getSubUnits();
		var sorted = [];
		$.each(units, function (i, uni) {
			if (!Object.keys(sorted).length) {
				sorted.push(uni);
			} else {
				$.each(sorted, function (j, val) {
					if (Number(uni.hp) >= Number(val.hp)) {
						sorted.splice(j, 0, uni);
						return false;
					} else if (j == sorted.length - 1) {
						sorted.push(uni);
					}
				});
			}
		});
		this.deleteSubUnits();
		$.each(sorted, function (i, val) {
			this.addUnitsSubArea(val.name, val.hp, val.key);
		});
	};
	prot.sortByAsc = function () {
		var units = cookie.getSubUnits();
		var sorted = [];
		$.each(units, function (i, uni) {
			if (!Object.keys(sorted).length) {
				sorted.push(uni);
			} else {
				$.each(sorted, function (j, val) {
					if (Number(uni.hp) <= Number(val.hp)) {
						sorted.splice(j, 0, uni);
						return false;
					} else if (j == sorted.length - 1) {
						sorted.push(uni);
					}
				});
			}
		});
		this.deleteSubUnits();
		$.each(sorted, function (i, val) {
			this.addUnitsSubArea(val.name, val.hp, val.key);
		});
	};
	return Unit;
})();

var Forces = (function () {
	var Forces = function (no) {
		this.no = no;
		this.unit_count = 0;
		this.unit1_hp = 0;
		this.unit2_hp = 0;
		this.unit3_hp = 0;
	};
	var prot = Forces.prototype;
	prot.setUnitHp = function (i, hp) {
		switch (i) {
			case 1:
				this.unit1_hp = hp;
				break;
			case 2:
				this.unit2_hp = hp;
				break;
			case 3:
				this.unit3_hp = hp;
				break;
		}
	};
	prot.getFullHp = function () {
		return Number(this.unit1_hp) + Number(this.unit2_hp) + Number(this.unit3_hp);
	};
	return Forces;
})();

var DeckClac = (function () {
	var DeckClac = function () {
	};
	var prot = DeckClac.prototype;
	prot.createDeckObject = function () {
		var forces_array = {};
		for (var i = 1; i <= 5; i++) {
			var hash = new Forces(i);
			$('#deck-' + i + ' .unit').each(function (j) {
				hash.unit_count = j + 1;
				hash.setUnitHp(j + 1, $(this).children('.hp').children('.val').html());
			});
			forces_array[i] = hash;
		}
		return forces_array;
	};
	prot.getAllHp = function (forces_array) {
		var ret = 0;
		Object.keys(forces_array).forEach(function (key) {
			ret += Number(forces_array[key].getFullHp());
		});
		return ret;
	};
	prot.setAllHp = function (forces_array) {
		$('#total-hp').html(this.getAllHp(forces_array));
	};
	prot.getForcesHp = function (forces_array, index) {
		return Number(forces_array[index].getFullHp());
	};
	prot.setForcesHp = function (forces_array) {
		for (var i = 1; i <= 5; i++) {
			$('#forces' + i + '-full-hp').html(this.getForcesHp(forces_array, i));
			$('#forces' + i + '-full-hp-sv').html(this.getForcesHp(forces_array, i));
		}
	};
	prot.setForcesPercentage = function (forces_array) {
		var full_hp = Number(this.getAllHp(forces_array));
		for (var i = 1; i <= 5; i++) {
			var p1 = Number(forces_array[i].unit1_hp) / full_hp * 100;
			var p2 = Number(forces_array[i].unit2_hp) / full_hp * 100;
			var p3 = Number(forces_array[i].unit3_hp) / full_hp * 100;
			var f_p = Number(forces_array[i].getFullHp() / full_hp * 100);
			$('#forces' + i + '-1-hp').html(p1.toFixed(2) + '%');
			$('#forces' + i + '-2-hp').html(p2.toFixed(2) + '%');
			$('#forces' + i + '-3-hp').html(p3.toFixed(2) + '%');
			$('#forces' + i + '-full-percentage').html(f_p.toFixed(2) + '%');
			$('#forces' + i + '-full-percentage-sv').html(f_p.toFixed(2) + '%');
		}
	};
	return DeckClac;
})();

var Cookie = (function () {
	var Cookie = function () {
	};
	var prot = Cookie.prototype;
	prot.addDatalist = function (key) {
		var flg = false;
		$('#data-name-list').find('option').each(function () {
			if ($(this).val() === key)
				flg = true;
		});
		if (flg) {
			com_obj.addLog('Datalist「' + key + '」overwrite');
		} else {
			com_obj.addLog('Datalist「' + key + '」add');
			var datalist = document.getElementById('data-name-list');
			var option = document.createElement('option');
			option.setAttribute('value', key);
			datalist.appendChild(option);
		}
		return;
	};
	prot.saveDatalist = function (key) {
		//var list = $.cookie(cookie_key_main_units_list);
		var list = JSON.parse(localStorage.getItem(cookie_key_main_units_list));
		if (com_obj.isArray(list) === false)
			list = [];
		if (list.indexOf(key) === -1)
			list.push(key);
		//$.cookie(cookie_key_main_units_list, list, {expires: 365});
		localStorage.setItem(cookie_key_main_units_list, JSON.stringify(list));
		return;
	};
	prot.initDatalist = function () {
		//$.cookie.json = true;
		//var ary = $.cookie(cookie_key_main_units_list);
		var ary = JSON.parse(localStorage.getItem(cookie_key_main_units_list));
		if (!ary)
			return;
		ary.forEach(function (val) {
			prot.addDatalist(val);
		});
		return;
	};
	prot.initUnitsList = function () {
		//$.cookie.json = true;
		//var ary = $.cookie(cookie_key_all_units);
		var ary = JSON.parse(localStorage.getItem(cookie_key_all_units));
		if (!ary)
			return;
		ary.forEach(function (val) {
			unit_obj.addUnitsSubArea(val['name'], val['hp'], val['key']);
		});
		return;
	};
	prot.save = function (key) {
		//$.cookie.json = true;
		this.saveAllUnits();
		this.saveMainUnits(key);
		this.addDatalist(key);
		this.saveDatalist(key);
	};
	prot.saveAllUnits = function () {
		com_obj.addLog('All units save');
		//$.cookie.json = true;
		var all_units = this.getAllUnits();
		//$.cookie(cookie_key_all_units, all_units, {expires: 365});
		localStorage.setItem(cookie_key_all_units, JSON.stringify(all_units));
		return;
	};
	prot.getAllUnits = function () {
		var ret = this.getSubUnits();
		for (var i = 1; i <= 5; i++) {
			$('#deck-' + i + ' .unit').each(function () {
				var hash = new Unit($(this).children('.name').html(), $(this).children('.hp').children('.val').html(), $(this).data('key'));
				ret.push(hash);
			});
		}
		return ret;
	};
	prot.getSubUnits = function () {
		var ret = [];
		$('#sub-unit-list').find('li').each(function () {
			var hash = new Unit($(this).children('.name').html(), $(this).children('.hp').children('.val').html(), $(this).data('key'));
			ret.push(hash);
		});
		return ret;
	};
	prot.saveMainUnits = function (key) {
		com_obj.addLog('Deck「' + key + '」save');
		//$.cookie.json = true;
		var main_units = this.getMainUnits();
		//$.cookie(cookie_key_main_units + key, main_units, {expires: 365});
		localStorage.setItem(cookie_key_main_units + key, JSON.stringify(main_units));
		return;
	};
	prot.getMainUnits = function () {
		var ret = {};
		for (var i = 1; i <= 5; i++) {
			var hash_array = [];
			$('#deck-' + i + ' .unit').each(function (j) {
				hash_array.push($(this).data('key'));
			});
			ret[i] = hash_array;
		}
		return ret;
	};
	prot.deleteUnits = function () {
		$('#delete-unit-list .unit').each(function () {
			com_obj.addLog('Delete「' + $(this).children('.name').html() + '/' + $(this).children('.hp').children('.val').html() + '」');
			$(this).remove();
		});
	};
	prot.load = function (key) {
		//var deck = $.cookie(cookie_key_main_units + key);
		var deck = JSON.parse(localStorage.getItem(cookie_key_main_units + key));
		if (deck == null) {
			com_obj.addLog('Data key「' + key + '」not found');
			return;
		}
		com_obj.addLog('Units delete');
		unit_obj.deleteUnits();
		com_obj.addLog('Units recovery');
		this.initUnitsList();
		Object.keys(deck).forEach(function (key) {
			if (deck[key].length > 0) {
				deck[key].forEach(function (val) {
					$('#sub-unit-list').find('li').each(function () {
						if (val === $(this).data('key')) {
							$(this).remove();
							unit_obj.addUnitsDeck($(this).children('.name').html(), $(this).children('.hp').children('.val').html(), val, key);
							return false;
						}
					});
				});
			}
		});
	};
	prot.unitsDelete = function () {
		this.deleteUnits();
		this.saveAllUnits();
	};
	prot.deckDelete = function (key) {
		//var deck = $.cookie(cookie_key_main_units + key);
		var deck = JSON.parse(localStorage.getItem(cookie_key_main_units + key));
		if (deck == null) {
			com_obj.addLog('Data key「' + key + '」not found');
			return;
		}
		com_obj.addLog('Remove data「' + key + '」');
		//$.removeCookie(cookie_key_main_units + key);
		localStorage.removeItem(cookie_key_main_units + key);
		//var list = $.cookie(cookie_key_main_units_list);
		var list = JSON.parse(localStorage.getItem(cookie_key_main_units_list));
		list.some(function (v, i) {
			if (v == key)
				list.splice(i, 1);
		});
		//$.cookie(cookie_key_main_units_list, list, {expires: 365});
		localStorage.setItem(cookie_key_main_units_list, JSON.stringify(list));
		$('#data-name-list').find('option').each(function () {
			if ($(this).val() == key) {
				$(this).remove();
			}
		});
	};
	prot.delete = function () {
		//$.removeCookie(cookie_key_all_units);
		localStorage.removeItem(cookie_key_all_units);
		com_obj.addLog('Remove cookie[all unit]');
		//if ($.cookie(cookie_key_main_units_list) != null) {
		//$.each($.cookie(cookie_key_main_units_list), function (i, val) {
		if (JSON.parse(localStorage.getItem(cookie_key_main_units_list)) != null) {
			$.each(JSON.parse(localStorage.getItem(cookie_key_main_units_list)), function (i, val) {
				com_obj.addLog('Remove cookie[' + val + ']');
				//$.removeCookie(cookie_key_main_units + val);
				localStorage.removeItem(cookie_key_main_units + val);
			});
		}
		//$.removeCookie(cookie_key_main_units_list);
		localStorage.removeItem(cookie_key_main_units_list);
		$('#data-name-list').html('');
		com_obj.addLog('Remove localStorage[deck list]');
		return true;
	};
	return Cookie;
})();

var DamageClac = (function () {
	var DamageClac = function () {
		/* construct */
	};
	var prot = DamageClac.prototype;
	prot.setDamage = function () {
		/*
		 * Case1
		 */
		/* Bahamut */
		this.setResultCase1('baha', [0.7]);
		/* Bahamut 1/2 */
		this.setResultCase1('baha-h', [0.35]);
		/* Leviathan */
		this.setResultCase1('levi', [0.7]);
		/* Orlando */
		this.setResultCase1('or', [0.5]);
		/* Orlando 1/2 */
		this.setResultCase1('or-h', [0.25]);
		/* Lorelei */
		this.setResultCase1('lore', [0.3]);
		/* Verethragna */
		this.setResultCase1('vere', [0.15]);
		/* Verethragna 1/2 */
		this.setResultCase1('vere-h', [0.075]);
		/* Titan */
		this.setResultCase1('titn', [0.2]);
		/* Walpurgis */
		this.setResultCase1('walp', [0.15]);
		/* Orlando and Lorelei */
		this.setResultCase1('orlr', [0.5, 0.3]);
		/* Orlando and Walpurgis */
		this.setResultCase1('orwl1', [0.5, 0.15]);
		this.setResultCase1('orwl2', [0.5, 0.15, 0.15]);
		/* Leviathan and Barrage */
		this.setResultCase1('lvbr1', [0.7, 0.3]);
		this.setResultCase1('lvbr2', [0.7, 0.3, 0.3]);
		this.setResultCase1('lvbr3', [0.7, 0.3, 0.3, 0.3]);
		/* Orlando and Barrage */
		this.setResultCase1('orbr1', [0.5, 0.3]);
		this.setResultCase1('orbr2', [0.5, 0.3, 0.3]);
		this.setResultCase1('orbr3', [0.5, 0.3, 0.3, 0.3]);
		/* Titan and Barrage */
		this.setResultCase1('ttbr1', [0.2, 0.3]);
		this.setResultCase1('ttbr2', [0.2, 0.3, 0.3]);
		this.setResultCase1('ttbr3', [0.2, 0.3, 0.3, 0.3]);
		this.setResultCase1('tt2br1', [0.2, 0.2, 0.3]);
		this.setResultCase1('tt2br2', [0.2, 0.2, 0.3, 0.3]);
		this.setResultCase1('tt2br3', [0.2, 0.2, 0.3, 0.3, 0.3]);
		/* Barrage */
		this.setResultCase1('brag1', [0.3]);
		this.setResultCase1('brag2', [0.3, 0.3]);
		this.setResultCase1('brag3', [0.3, 0.3, 0.3]);
		this.setResultCase1('brag4', [0.3, 0.3, 0.3, 0.3]);
		this.setResultCase1('brag5', [0.3, 0.3, 0.3, 0.3, 0.3]);

		/*
		 * Case2
		 */
		/* Bahamut */
//		this.setResultCase2('baha', [0.7]);
		/* Bahamut 1/2 */
//		this.setResultCase2('baha-h', [0.35]);
		/* Leviathan */
//		this.setResultCase2('levi', [0.7]);
		/* Orlando */
//		this.setResultCase2('or', [0.5]);
		/* Orlando 1/2 */
//		this.setResultCase2('or-h', [0.25]);
		/* Lorelei */
//		this.setResultCase2('lore', [0.3]);
		/* Barrage */
//		this.setResultCase2('brag1', [0.3]);
//		this.setResultCase2('brag2', [0.3, 0.3]);
//		this.setResultCase2('brag3', [0.3, 0.3, 0.3]);
		/* Bahamut */
		this.setResultCase2('baha', [0.7]);
		/* Bahamut 1/2 */
		this.setResultCase2('baha-h', [0.35]);
		/* Leviathan */
		this.setResultCase2('levi', [0.7]);
		/* Orlando */
		this.setResultCase2('or', [0.5]);
		/* Orlando 1/2 */
		this.setResultCase2('or-h', [0.25]);
		/* Lorelei */
		this.setResultCase2('lore', [0.3]);
		/* Verethragna */
		this.setResultCase2('vere', [0.15]);
		/* Verethragna 1/2 */
		this.setResultCase2('vere-h', [0.075]);
		/* Titan */
		this.setResultCase2('titn', [0.2]);
		/* Walpurgis */
		this.setResultCase2('walp', [0.15]);
		/* Orlando and Lorelei */
		this.setResultCase2('orlr', [0.5, 0.3]);
		/* Orlando and Walpurgis */
		this.setResultCase2('orwl1', [0.5, 0.15]);
		this.setResultCase2('orwl2', [0.5, 0.15, 0.15]);
		/* Leviathan and Barrage */
		this.setResultCase2('lvbr1', [0.7, 0.3]);
		this.setResultCase2('lvbr2', [0.7, 0.3, 0.3]);
		this.setResultCase2('lvbr3', [0.7, 0.3, 0.3, 0.3]);
		/* Orlando and Barrage */
		this.setResultCase2('orbr1', [0.5, 0.3]);
		this.setResultCase2('orbr2', [0.5, 0.3, 0.3]);
		this.setResultCase2('orbr3', [0.5, 0.3, 0.3, 0.3]);
		/* Titan and Barrage */
		this.setResultCase2('ttbr1', [0.2, 0.3]);
		this.setResultCase2('ttbr2', [0.2, 0.3, 0.3]);
		this.setResultCase2('ttbr3', [0.2, 0.3, 0.3, 0.3]);
		this.setResultCase2('tt2br1', [0.2, 0.2, 0.3]);
		this.setResultCase2('tt2br2', [0.2, 0.2, 0.3, 0.3]);
		this.setResultCase2('tt2br3', [0.2, 0.2, 0.3, 0.3, 0.3]);
		/* Barrage */
		this.setResultCase2('brag1', [0.3]);
		this.setResultCase2('brag2', [0.3, 0.3]);
		this.setResultCase2('brag3', [0.3, 0.3, 0.3]);
		this.setResultCase2('brag4', [0.3, 0.3, 0.3, 0.3]);
		this.setResultCase2('brag5', [0.3, 0.3, 0.3, 0.3, 0.3]);

                destDamageResult

		/*
		 * Case3
		 */
		/* Orlando -> Lorelei */
//		this.setResultCase3('otl', [0.5], [0.3]);
		/* Orlando -> Walpurgis */
//		this.setResultCase3('otw', [0.5], [0.15]);
		/* Orlando -> Barrage */
//		this.setResultCase3('otb1', [0.5], [0.3]);
		/* Orlando -> Barrage x 2 */
//		this.setResultCase3('otb2', [0.5], [0.3, 0.3]);
		/* Orlando -> Barrage x 3 */
//		this.setResultCase3('otb3', [0.5], [0.3, 0.3, 0.3]);
		/* Leviathan -> Barrage */
//		this.setResultCase3('ltb1', [0.7], [0.3]);
		/* Leviathan -> Barrage x 2 */
//		this.setResultCase3('ltb2', [0.7], [0.3, 0.3]);
		/* Leviathan -> Barrage x 3 */
//		this.setResultCase3('ltb3', [0.7], [0.3, 0.3, 0.3]);
		/* Barrage -> Barrage */
//		this.setResultCase3('btb1', [0.3], [0.3]);
		/* Barrage -> Barrage x 2 */
//		this.setResultCase3('btb2', [0.3], [0.3, 0.3]);
		/* Barrage -> Barrage x 3 */
//		this.setResultCase3('btb3', [0.3], [0.3, 0.3, 0.3]);

	};
	prot.setResultCase1 = function (prefix, damages) {
//		var last_forces_hp = deck_obj.getLastForcesHp();
		var after_hp = this.clacDamage(deck_obj.total, damages, 0);
//		var add_after_hp = this.clacDamage(deck_obj.total, damages, last_forces_hp);
		$('#' + prefix + '-hp').html(after_hp);
//		$('#' + prefix + '-add-hp').html(add_after_hp);
		$('#' + prefix + '-fc').html(deck_obj.getForcesCountAfter(after_hp));
//		$('#' + prefix + '-fc-sv').html(deck_obj.getForcesCountAfter(after_hp));
//		$('#' + prefix + '-add-fc').html(deck_obj.getForcesCountAfter(add_after_hp));
		$('#' + prefix + '-uc').html(deck_obj.getUnitCountAfter(after_hp));
		$('#' + prefix + '-fc-sv').html(deck_obj.getAdventUnitCountAfter(after_hp));
//		$('#' + prefix + '-add-uc').html(deck_obj.getUnitCountAfter(add_after_hp));
		$('#' + prefix + '-mapping-forces').html(this.createMapping(deck_obj.getForcesCount(), deck_obj.getForcesCountAfter(after_hp)));
		$('#' + prefix + '-mapping-units').html(this.createMapping(deck_obj.getUnitCount(), deck_obj.getUnitCountAfter(after_hp)));
//		$('#' + prefix + '-add-mapping-forces').html(this.createMapping(deck_obj.getForcesCount(), deck_obj.getForcesCountAfter(add_after_hp)));
//		$('#' + prefix + '-add-mapping-units').html(this.createMapping(deck_obj.getUnitCount(), deck_obj.getUnitCountAfter(add_after_hp)));
	};
	prot.setResultCase2 = function (prefix, damages) {
		var sum = function (arr) {
			if (arr.length === 0)
				return 0;
			return arr.reduce(function (prev, current, i, arr) {
				return Number(prev) + Number(current);
			});
		};
		var deck_hp_array = deck_obj.getForcesHpArray();
		var after_hp = this.clacDamage(deck_obj.total, damages, 0);
		var forces_count = 0;
		$.each(deck_hp_array.reverse(), function (i, val) {
			if (val.length == 0) {
				return true;
			}
			after_hp -= sum(val);
			forces_count++;
			if (after_hp <= 0)
				return false;
		});
		$('#' + prefix + '-tag').html(forces_count);
		$('#' + prefix + '-tag-sv').html(forces_count);
//		$('#' + prefix + '-uc-c').html();
	};
	prot.destDamageResult = function (all, on) {
	};
	prot.createMapping = function (all, on) {
		var ret = '';
		for (var i = 1; i <= all; i++) {
			if (i <= on) {
				ret += '<span class="on"></span>';
			} else {
				ret += '<span></span>';
			}
		}
		return ret;
	};
	prot.clacDamage = function (full_hp, damages, add_damage) {
		var ret = 0;
		var now_hp = Number(full_hp);
		var total_damage = 0;
		for (var i = 0, len = damages.length; i < len; ++i) {
			total_damage = total_damage + (now_hp * Number(damages[i]));
			now_hp = now_hp - (now_hp * Number(damages[i]));
		}
		total_damage = total_damage + add_damage;
		ret = full_hp - total_damage;
		if (ret < 0) {
			ret = 0;
		}
		return Math.round(ret);
	};
	return DamageClac;
})();



var com_obj = new Common();
var deck_obj = new Deck();
var unit_obj = new Unit();
var deck_clac_obj = new DeckClac();
var damage_clac_obj = new DamageClac();
var cookie = new Cookie();



$(function () {

	var agent = navigator.userAgent;

	if (agent.search(/iPhone/) != -1 || agent.search(/iPad/) != -1 || agent.search(/iPod/) != -1 || agent.search(/Android/) != -1) {
		$('#device-error').modal('show');
	}

	function execDeckDataClac() {
		com_obj.addLog('Deck data calculation');
		var forces_array = deck_clac_obj.createDeckObject();
		deck_clac_obj.setAllHp(forces_array);
		deck_clac_obj.setForcesHp(forces_array);
		deck_clac_obj.setForcesPercentage(forces_array);
		return;
	}

	function execDamageClac() {
		com_obj.addLog('Damage calculation');
		deck_obj.setDeckData();
		damage_clac_obj.setDamage();

		svl_reset();
		svl_clac();
		return;
	}

	function addUnit(name, hp) {
		unit_obj.addUnitsSubArea(name, hp, '');
		cookie.saveAllUnits();
		return;
	}

	$(window).load(function () {
		com_obj.addLog('Datalist init');
		cookie.initDatalist();
		com_obj.addLog('Units recovery');
		cookie.initUnitsList();
		if(localStorage.getItem(cookie_key_wishlist_view) != 'no') {
			$('#wishlist').slideDown(300);
		} else {
			$('#wishlist-show').fadeIn(300);
		}
	});

	$('#cookie-reload').on('click', function () {
		unit_obj.deleteUnits();
		com_obj.addLog('Datalist init');
		cookie.initDatalist();
		com_obj.addLog('Units recovery');
		cookie.initUnitsList();
		return false;
	});

	$('.jquery-ui-sortable').sortable({
		connectWith: '.jquery-ui-sortable',
		cancel: '.stop',
		update: function (e, ui) {
			if (this === ui.item.parent()[0]) {
				var id = $(this).attr('id');
				if (!id) {
				} else if (id.indexOf('deck-') !== -1) {
					var cnt = $('#' + id + ' li').length;
					if (cnt > 3) {
						com_obj.addLog('Units over');
						$('.jquery-ui-sortable').sortable('cancel');
						return;
					}
				}
				execDeckDataClac();
				execDamageClac();
			}
		}
	});
	$('.jquery-ui-sortable').disableSelection();

	$('#add-unit').on('click', function () {
		var name = $('#new-unit-name').val();
		var hp = $('#new-unit-hp').val();
		var key = $('#new-unit-id').val();
		if (key == '') {
			if (name !== '' && hp > 0) {
				addUnit(name, hp);
			} else {
				com_obj.addLog('Unit add failed');
			}
		} else {
			$('.unit').each(function () {
				var target_key = $(this).data('key');
				if (key == target_key) {
					$(this).children('.name').html(name);
					$(this).children('.hp').children('.val').html(hp);
					cookie.saveAllUnits();
					execDeckDataClac();
					execDamageClac();
				}
			});
		}
		$('#clear-unit').trigger('click');
		return false;
	});
	$('#clear-unit').on('click', function () {
		$('#new-unit-name').val('');
		$('#new-unit-hp').val('');
		$('#new-unit-id').val('');
		$('#editing-message').html('ユニット新規追加');
		return false;
	});
	$(document).on('click', '.edit-unit', function () {
		var name = $(this).parent().parent('.unit').find('.name').html();
		var hp = $(this).parent().parent('.unit').children('.hp').children('.val').html();
		var key = $(this).parent().parent('.unit').data('key');
		$('#new-unit-name').val(name);
		$('#new-unit-hp').val(hp);
		$('#new-unit-id').val(key);
		$('#editing-message').html('ユニット『' + name + '(key:' + key + ')』を編集中です。');
	});

	$('#delete-unit').on('click', function () {
		cookie.unitsDelete();
		return false;
	});

	$('#data-clear').on('click', function () {
		$('#data-name').val('');
		return false;
	});

	$('#data-save').on('click', function () {
		var key = $('#data-name').val();
		if (key !== '') {
			cookie.save(key);
		} else {
			com_obj.addLog('Data Key nothing');
		}
		return false;
	});

	$('#data-load').on('click', function () {
		var key = $('#data-name').val();
		if (key !== '') {
			cookie.load(key);
		} else {
			com_obj.addLog('Data Key nothing');
		}
		execDeckDataClac();
		execDamageClac();
		return false;
	});
	$('#data-delete').on('click', function () {
		var key = $('#data-name').val();
		if (key !== '') {
			cookie.deckDelete(key);
			$('#data-clear').trigger('click');
		} else {
			com_obj.addLog('Data Key nothing');
		}
		return false;
	});

	$('.stage').on('click', function () {
		var stage = $(this).data('stage');
		com_obj.addLog('Narrowing [' + stage + ']');
		$('.stage').removeClass('active');
		$(this).addClass('active');
		$('.stage-table').find('.data-row').each(function () {
			var hash = $(this).data('stage');
			var hash_array = hash.split(',');
			if ($.inArray(stage, hash_array) >= 0) {
				$(this).show();
			} else {
				$(this).hide();
			}
		});
		return false;
	});


	$('#unit-sort-desc').on('click', function () {
		com_obj.addLog('Unit sort by desc');
		unit_obj.sortByDesc();
		cookie.saveAllUnits();
		return false;
	});
	$('#unit-sort-asc').on('click', function () {
		com_obj.addLog('Unit sort by asc');
		unit_obj.sortByAsc();
		cookie.saveAllUnits();
		return false;
	});

	$('.add-sample-unit').on('click', function () {
		unit_obj.addUnitsSubArea($(this).val(), $(this).data('hp'), '');
		cookie.saveAllUnits();
		return false;
	});

	$('#cookie-all-delete').on('click', function () {
		if (cookie.delete()) {
			unit_obj.deleteUnits();
			com_obj.addLog('Finish delete localStorage');
			$('#cookie-delete-confirm').modal('hide');
		}
		return false;
	});


	$('#export-storage-data').on('click', function () {
		var content = {};
		content[cookie_key_all_units] = JSON.parse(localStorage.getItem(cookie_key_all_units));
		content[cookie_key_main_units_list] = JSON.parse(localStorage.getItem(cookie_key_main_units_list));
		var ary = JSON.parse(localStorage.getItem(cookie_key_main_units_list));
		if (ary) {
			ary.forEach(function (val) {
				content[cookie_key_main_units + val] = JSON.parse(localStorage.getItem(cookie_key_main_units + val));
			});
		}
		var blob = new Blob([JSON.stringify(content)], {"type": "text/plain"});
		if (window.navigator.msSaveBlob) {
			window.navigator.msSaveBlob(blob);
			window.navigator.msSaveOrOpenBlob(blob);
		} else {
			document.getElementById("export-storage-data").href = window.URL.createObjectURL(blob);
		}
	});
	$('#import-storage-data').on('click', function () {
		if ($('#storage-file').val() == '') {
			com_obj.addLog('Storage data file nothing.');
			return false;
		}
		var storage_file = document.getElementById("storage-file").files[0];
		var reader = new FileReader();
		reader.onload = function () {
			var data = $.parseJSON(reader.result);
			if (data) {
				for (var key in data) {
					localStorage.setItem(key, JSON.stringify(data[key]));
				}
				$('#cookie-reload').trigger('click');
			}
		};
		reader.readAsText(storage_file);
	});

	$('#simplicity-view-right-close').on('click', function () {
		$('#simplicity-view-right').fadeToggle();
	});
	$('#simplicity-view-right-show').on('click', function () {
		$('#simplicity-view-right').fadeToggle();
	});
	$('#simplicity-view-left-close').on('click', function () {
		$('#simplicity-view-left').fadeToggle();
	});
	$('#simplicity-view-left-show').on('click', function () {
		$('#simplicity-view-left').fadeToggle();
	});

	$('#svl-reset').on('click', function () {
		svl_reset();
		svl_clac();
	});
	$('.svl-command').on('click', function () {
		var damage = Math.round(Number($('#all-hp-sv').html()) * Number($(this).data('damage')));
		$('#all-hp-sv').html(Number($('#all-hp-sv').html()) - damage);
		$('#manual-check-log').append('<p>' + $(this).html() + '</p>');
		svl_clac();
	});
	$('#svl-tag').on('click', function () {
		$('.tag-check-svl').remove();
		$('#tag-forces-hp-sv').html($('#force-hp-sv').val() + '(' + $('#another-forces-count-sv').html() + '部隊 / ' + $('#force-unit-count-sv').val() + 'ユニ)');
		$('#manual-check-log').append('<p class="tag-check-svl">' + $(this).html() + '</p>');
	});
	function svl_reset() {
		$('#all-hp-sv').html(deck_obj.total);
		$('#manual-check-log p').remove();
		$('#another-forces-count-sv').html(deck_obj.getForcesCount());
		$('#another-unit-count-sv').html(deck_obj.getUnitCount());
		$('#tag-forces-hp-sv').html('');
	}
	function svl_clac() {
		var now_hp = Number($('#all-hp-sv').html());
		var deck_hp_cumulative = 0;
		var loop_end_flg = false;
		var force_no = 0;
		var unit_count = 0;
		var force_unit_count = 0;
		var force_hp = 0;
		$.each(deck_obj.getForcesHpArray(), function (i, force) {
			force_hp = 0;
			force_unit_count = 0;
			$.each(force, function (j, val) {
				deck_hp_cumulative += Number(val);
				force_hp += Number(val);
				force_unit_count += 1;
				unit_count += 1;
				if (deck_hp_cumulative >= now_hp) {
					force_no = i;
					unit_no = j;
					loop_end_flg = true;
					return false;
				}
			});
			if (loop_end_flg === true) {
				return false;
			}
		});
		$('#another-forces-count-sv').html(force_no + 1);
		$('#another-unit-count-sv').html(unit_count);
		$('#force-hp-sv').val(force_hp);
		$('#force-unit-count-sv').val(force_unit_count);
		return;
	}
	
	$('#remove-wishlist-section').on('click', function () {
		$('#wishlist').slideUp(300);
	});
	$('#remove-eternal-wishlist').on('click', function () {
		localStorage.setItem(cookie_key_wishlist_view, 'no');
		$('#wishlist').slideUp(300);
		$('#wishlist-show').fadeIn(300);
	});
	$('#wishlist-show').on('click', function () {
		localStorage.setItem(cookie_key_wishlist_view, 'yes');
		$('#wishlist').slideDown(300);
		$('#wishlist-show').fadeOut(300);
	});
});


