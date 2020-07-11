const ptBR = {
  navBar: {
    title: 'Cidade',
  },
  form: {
    title: 'Criar Cidade',
    name: 'Nome da Cidade',
    population: 'Quantidade de Habitantes',
    avarage: 'Renda Média',
    country: 'País',
    state: 'Estado',
    foundation: 'Fundado em',
    create: 'Criar',
    creating: 'Criando',
    close: 'Fechar',
    citySuccessCreated: 'A Cidade foi cadastrada com sucesso.',
  },
  labels: {
    searchCity: 'Buscar Cidade',
    population: 'População',
    cityNotFound: 'Nenhuma Cidade Encontrada',
  }
}

const enUS = {
  navBar: {
    title: 'City',
  },
  form: {
    title: 'Create a City',
    name: "City's Name",
    population: 'Number of Inhabitants',
    avarage: 'Avarage Income',
    country: 'Country',
    state: 'State',
    foundation: 'Founded on',
    create: 'Create',
    creating: 'Creating',
    close: 'Close',
    citySuccessCreated: 'The City was successfully registered.',
  },
  labels: {
    searchCity: 'Search a City',
    population: 'Population',
    cityNotFound: 'City Not Found',
  },
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
  delimiters: ["[[", "]]"],
  created: function () {
    this.changeLocale(this.$i18n.locale);
  },
  data: {
    isLoading: false,
    cityData: {
      "name": "",
      "population_count": null,
      "avarage_income": null,
      "country": "",
      "state": "",
      "foundation_date": null,
    },
    cityList: [],
    search: "",
    cityNotFound: false,
    errorCreateCity: '',
    citySuccessCreated: false,
  },
  methods: {
    cleanAllData: function () {
      this.cityData = {
        "name": "",
        "population_count": null,
        "avarage_income": null,
        "country": "",
        "state": "",
        "foundation_date": null,
      };
      this.errorCreateCity = '';
      return;
    },

    changeLocale: function (locale) {
      this.$i18n.locale = locale;
    },

    searchCity: function (search) {
      this.cityNotFound = false;
      this.setLoadingState(true);
      const params = {
        name: search,
      }
      if (search === "") {
        this.setLoadingState(false);
        return this.cityList = [];
      };
      axios.get('/api/v.1/city', { params })
        .then((response) => {
          this.cityList = response.data.map(
            row => ({
              name: row.name,
              population_count: row.population_count,
              avarage_income: row.avarage_income,
              country: row.country,
              state: row.state,
              foundation_date: moment(row.foundation_date).toDate(),
              id: row.id,
            })
          );
          if (this.cityList.length === 0) {
            this.cityNotFound = true;
          }
          this.setLoadingState(false);
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
          this.setLoadingState(false);
        });
    },

    debouncedSearchCity: _.debounce(function (search) { this.searchCity(search) }, 500),

    setLoadingState: function (value) {
      return this.isLoading = value;
    },

    setCitySuccessCreated: function (value) {
      return this.citySuccessCreated = value;
    },

    createCity: function (cityData) {
      this.setLoadingState(true);
      if (this.cityData.name === "") {
        this.errorCreateCity = 'Campo "Nome da Cidade" está vazio.';
        this.setLoadingState(false);
        return;
      }
      if (this.cityData.population_count === "") {
        this.errorCreateCity = 'Campo "População" está vazio.';
        this.setLoadingState(false);
        return;
      }
      if (this.cityData.avarage_income === "") {
        this.errorCreateCity = 'Campo "Renda Média" está vazio.';
        this.setLoadingState(false);
        return;
      }
      if (this.cityData.country === "") {
        this.errorCreateCity = 'Campo "País" está vazio.';
        this.setLoadingState(false);
        return;
      }
      if (this.cityData.state === "") {
        this.errorCreateCity = 'Campo "Estado" está vazio.';
        this.setLoadingState(false);
        return;
      }
      if (this.cityData.foundation_date === "") {
        this.errorCreateCity = 'Campo "Fudando em" está vazio.';
        this.setLoadingState(false);
        return;
      }
      axios.post('/api/v.1/city', cityData)
      .then((response) => {
          this.searchCity(cityData.name);
          this.search = cityData.name;
          this.cleanAllData();
          this.setLoadingState(false);
          this.setCitySuccessCreated(true)
          console.log(response);
        })
        .catch((error) => {
          this.setLoadingState(false);
          console.log(error.response.data);
        });
    },
  }
})
