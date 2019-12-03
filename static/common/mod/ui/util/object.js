module.exports = {
	get: function(data, name){
		if(data[name]){
			return data[name];
		}

		name = name.split('.');

		var i = 0, len = name.length, tmp = data;

		for(; i < len; i++){
			tmp = tmp[name[i]];

			if(tmp == null) return null;
		}

		return tmp;
	},

	set: function(data, name, value){
		if(typeof value == 'undefined'){
			data = name;
		}else{
			name = name.split('.');

			var i = 0, len = name.length - 1, tmp = data;

			for(; i < len; i++){
				var tmpName = name[i];

				if(typeof tmp[tmpName] != 'object' || !tmp[tmpName]){
					tmp[tmpName] = {};
				}

				tmp = tmp[tmpName];
			}

			tmp[name[i]] = value;
		}
	},

	toJSONString: function(obj){
		return JSON.stringify(obj);
	},

	jsonEncode: function(obj){
		return JSON.stringify(obj);
	},

	parseJSON: function(str){
		return JSON.parse(str);
	},

	jsonDecode: function(str){
		return JSON.parse(str);
	}
};