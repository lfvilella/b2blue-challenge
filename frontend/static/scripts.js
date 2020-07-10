

const ptBR = {
  navBar: {
    title: 'Cidade',
  },
  labels: {
    serachCity: 'Buscar Cidade',
  }
}

const enUS = {
  navBar: {
    title: 'City',
  },
  labels: {
    serachCity: 'Search a City',
  }
}


Vue.use(VueI18n);

var app = new Vue({
  i18n: new VueI18n({
    locale: 'pt-BR',
    messages: {
      'pt-BR': ptBR,
      'en-US': enUS,
    }
  }),
  el: '#app',
  created: function () {
    this.changeLocale(this.$i18n.locale);
  },
  data: {
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
    cityNotFound: false,
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
      this.$i18n.locale = locale;
    },

    searchCity: function (search) {
      this.cityNotFound = false;
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
              foundationDate: moment(row.foundationDate).toDate(),
              id: row.id,
            })
          );
          if (this.cityList.length === 0) {
            this.cityNotFound = true;
          }
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
      this.isLoading = true;
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
          this.isLoading = false;
          console.log(response);
        })
        .catch((error) => {
          this.isLoading = false;
          console.log(error.response.data);
        });
    },
  }
})
