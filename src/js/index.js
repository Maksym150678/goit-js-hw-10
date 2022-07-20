import "../css/styles.css";
import { fetchCountries } from "../js/fetch.js";
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import countrys from '../templates/countrys.hbs';
import country from '../templates/country.hbs';

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('input');
const listEl = document.querySelector('.country-list');
const divEl = document.querySelector('.country-info');

const inSearch = () => {
    let targetCountry = inputEl.value.trim();
    divEl.innerHTML = '';
    listEl.innerHTML = '';
    if (targetCountry.length > 0) {
        fetchCountries(targetCountry)
        .then(data => {
            if (data.length > 10) {
                Notiflix.Notify.info(
                    'Too many matches found. Please enter a more specific name.'
                );
            } else if (data.length > 2 && data.length < 10) {
                listEl.innerHTML = countrys(data);
            } else if (data.length === 1) {
                const resultValue = data[0];
                
                resultValue.languages = Object.values(resultValue.languages).join(',');
                divEl.innerHTML = country(resultValue);
                console.log(divEl); 
            }
        })
        .catch(err => {
            if (err.message === '404') {
                Notiflix.Notify.failure('Oops, there is no country with that name');
            }
        })
    }
}

inputEl.addEventListener('input', debounce(inSearch, DEBOUNCE_DELAY));