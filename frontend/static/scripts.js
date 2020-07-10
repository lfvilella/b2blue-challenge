var app = new Vue({
  el: '#app',
  created: function () {
    this.changeLocale(this.locale);
  },
  data: {
    locale: 'pt-br',
    isLoading: false,
    cityData: {
      "name": "",
      "populationCount": '',
      "avarageIncome": '',
      "country": "",
      "state": "",
      "foundationDate": "",
    },
    cityList: [],
    search: "",
    errorCreateCity: '',
  },
  methods: {
    cleanAllData: function () {
      this.cityData = {
        "name": "",
        "populationCount": '',
        "avarageIncome": '',
        "country": "",
        "state": "",
        "foundationDate": "",
      };
      this.errorCreateCity = '';
      return;
    },

    changeLocale: function (locale) {
      this.locale = locale;
      moment.locale(locale);
    },

    searchCity: function (search) {
      this.isLoading = true;
      const params = {
        name: search,
      }
      if (search === "") {
        this.isLoading = false;
        return this.cityList = [];
      };
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

    debouncedSearchCity: _.debounce(function (search) { this.searchCity(search) }, 500),

    createCity: function (cityData) {
      if (this.cityData.name === "") {
        this.errorCreateCity = 'Campo "Nome da Cidade" está vazio.';
        // this.setLoadingState(false);
        return;
      }
      if (this.cityData.populationCount === "") {
        this.errorCreateCity = 'Campo "População" está vazio.';
        // this.setLoadingState(false);
        return;
      }
      if (this.cityData.avarageIncome === "") {
        this.errorCreateCity = 'Campo "Renda Média" está vazio.';
        // this.setLoadingState(false);
        return;
      }
      if (this.cityData.country === "") {
        this.errorCreateCity = 'Campo "País" está vazio.';
        // this.setLoadingState(false);
        return;
      }
      if (this.cityData.state === "") {
        this.errorCreateCity = 'Campo "Estado" está vazio.';
        // this.setLoadingState(false);
        return;
      }
      if (this.cityData.foundationDate === "") {
        this.errorCreateCity = 'Campo "Fudando em" está vazio.';
        // this.setLoadingState(false);
        return;
      }
      axios.post('/api/v.1/city', cityData)
        .then((response) => {
          this.searchCity(cityData.name);
          this.search = cityData.name;
          this.cleanAllData();
          console.log(response);
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    },
  }
})
