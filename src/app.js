import CitySelector from './CitySelector';
$(document).ready(() => {
    let $citySelector = $('#citySelector');
    let $region = $('#regionText');
    let $city = $('#localityText');
    let $info = $('#info');

    $('#createCitySelector').on('click', () => {
        $info.css('display', 'block');
        $('#citySelector').html("<div  id='selectorId'></div>");
        new CitySelector({
            selectorId: 'selectorId',
            region: $region,
            city : $city
        });
    });

    $('#destroyCitySelector').on ('click', () => {
        $('#selectorId').remove();
        console.log('delet CitySelector: ' + '#selectorId');
        $city.text("");
        $region.text("");
        $info.css('display', 'none');
    });
});

