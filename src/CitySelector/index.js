require('./style.less');

class CitySelector {
	constructor(properties) {
		this.area = {region: 0, city: "", id: 0};
		this.region = properties.region;
		this.city = properties.city;
		this.selector = $('#' + properties.selectorId).html('<button class="button" id="regionButton">Выбрать регион</button> <select class="list" id="regionList"></select> <select class="list" id="cityList"></select> <button class="button" id="buttonSave">Сохранить</button> <i  id="result"></i>');
		this.regionButton = $(this.selector).find('#regionButton');
		this.regionList = $(this.selector).find('#regionList').css('display', 'none');
		this.cityList = $(this.selector).find('#cityList').css('display', 'none');
		this.saveButton = $(this.selector).find('#buttonSave').css('display', 'none');
		this.result = $(this.selector).find('#result');
		this.regionButton.on('click', () => {
			this.getRegion();
		});
		this.saveButton.on('click', () => {
			this.sendData();
		});
		this.selector.on('changed:city', () => {
			this.region.text(this.area.region);
			this.city.text(this.area.city);
		});

		this.selector.on('changed:region', () => {
			this.region.text(this.area.region);
		});
	}
	getRegion() {
		this.regionList.css('display', 'inline-block');
		this.regionButton.css('display', 'none');
		this.regionList.size = 3;
		fetch('http://localhost:3000/regions').then((response) => {
			let data = response.json();  
			return data;
		}).then((data) => {
			console.log(data);
			let regions = data.map((item) => {
				return ("<option class='list__option' value='" + item.id + "'>" + item.title + "</option>");
			});
			this.renderItem(this.regionList, regions);
			this.regionList.on('change', () => {
				this.area.region = this.regionList[0].value;
				this.selector.trigger('changed:region');
				this.area.city = "";
				this.cityList.css('display', 'inline-block');
				this.getCity();
				this.selector.trigger('changed:city');
			});
			console.log("success");
		})
		.catch(() => {
			console.log("error");
		});
	}

	getCity() {	
		fetch(`http://localhost:3000/localities/${this.area.region}`).then((response) => {
			let data = response.json();  
			return data;
		}).then((data) => {
			console.log(data.list);
			let cities = data.list.map((item, key) => {
				return ("<option class='list__city-option' value='" + item + "'>" + item + "</option>");
			});
			this.renderItem(this.cityList, cities);
			this.cityList.on('change', () =>{
				this.area.city = this.cityList[0].value;
				console.log(this.cityList);
				this.selector.trigger("changed:city");
				this.saveButton.css('display', 'inline-block');
			});
			console.log("success");

		}).catch(() => {
			console.log("error");
		})
	}
	getResult() {
		fetch(`http://localhost:3000/selectedRegions`).then((response) => {
				let data = response.json();  
				return data;
			}).then((data) => {
				let result = data.slice(-1);
				console.log("result success");
				this.renderComponent(this.selector, result);
			}).catch(() => {
				console.log("result error");
			});
	}
	sendData() {
		$.ajax({
			method: "POST",
			async: false,
			url: 'http://localhost:3000/selectedRegions',
			contentType: 'application/json',
			data: JSON.stringify(this.area),
		}).then(() => {
			console.log("send data -> success");
			this.getResult();		
		}).catch(() => {
			console.log("error");
		});
	}

	renderItem(item, items) {
		item.attr('size', items.length);
		item.html(items.join(''));
	}
	renderComponent(el,items) {
		this.result.text(JSON.stringify(items));
		this.selector.html(this.result);
	}
}
export default CitySelector;