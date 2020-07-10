var app = new Vue({
  el: '#app',
  created: function () {
    this.changeLocale(this.locale);
  },
  data: {
    locale: 'pt-br',
    isLoading: false,
    cityData: {
      "name": "Fartura",
      "populationCount": '16000',
      "avarageIncome": '1000',
      "country": "BR",
      "state": "SP",
      "foundationDate": "",
    },
    cityList: [],
    search: "",
  },
  methods: {
    changeLocale: function (locale) {
      this.locale = locale;
      moment.locale(locale);
    },

    searchCity: function (search) {
      this.isLoading = true;
      const params = {
        name: search,
      }
      axios.get('/api/v.1/city', { params })
        .then((response) => {
          this.cityList = response.data.map(
            row => ({
              name: row.name,
              population_count: row.population_count,
              avarageIncome: row.avarageIncome,
              country: row.country,
              state: row.state,
              foundationDate: moment(row.foundationDate).format('L'),
              id: row.id,
            })
          );
          this.isLoading = false;
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
          this.isLoading = false;
        });
    },

    debouncedSearchCity: _.debounce(function(search) {this.searchCity(search)}, 500),

    createCity: function (cityData) {
      axios.post('/api/v.1/city', cityData)
        .then((response) => {
          this.searchCity(cityData.name);
          this.search = cityData.name;
          console.log(response);
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    },
  }
})
