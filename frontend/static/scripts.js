const statesBR = [
  { "nome": "Acre", "sigla": "AC" },
  { "nome": "Alagoas", "sigla": "AL" },
  { "nome": "Amapá", "sigla": "AP" },
  { "nome": "Amazonas", "sigla": "AM" },
  { "nome": "Bahia", "sigla": "BA" },
  { "nome": "Ceará", "sigla": "CE" },
  { "nome": "Distrito Federal", "sigla": "DF" },
  { "nome": "Espírito Santo", "sigla": "ES" },
  { "nome": "Goiás", "sigla": "GO" },
  { "nome": "Maranhão", "sigla": "MA" },
  { "nome": "Mato Grosso", "sigla": "MT" },
  { "nome": "Mato Grosso do Sul", "sigla": "MS" },
  { "nome": "Minas Gerais", "sigla": "MG" },
  { "nome": "Pará", "sigla": "PA" },
  { "nome": "Paraíba", "sigla": "PB" },
  { "nome": "Paraná", "sigla": "PR" },
  { "nome": "Pernambuco", "sigla": "PE" },
  { "nome": "Piauí", "sigla": "PI" },
  { "nome": "Rio de Janeiro", "sigla": "RJ" },
  { "nome": "Rio Grande do Norte", "sigla": "RN" },
  { "nome": "Rio Grande do Sul", "sigla": "RS" },
  { "nome": "Rondônia", "sigla": "RO" },
  { "nome": "Roraima", "sigla": "RR" },
  { "nome": "Santa Catarina", "sigla": "SC" },
  { "nome": "São Paulo", "sigla": "SP" },
  { "nome": "Sergipe", "sigla": "SE" },
  { "nome": "Tocantins", "sigla": "TO" }
]


const ptBR = {
  navBar: {
    title: 'Cidade',
  },
  form: {
    title: 'Criar Cidade',
    name: 'Nome da Cidade',
    population: 'Quantidade de Habitantes',
    avarage: 'Renda Média',
    state: 'Estado',
    foundation: 'Fundado em',
    create: 'Criar',
    creating: 'Criando',
    close: 'Fechar',
    citySuccessCreated: 'A Cidade foi cadastrada com sucesso.',
  },
  formCityError: {
    NoName: 'Campo "Nome" está vazio',
    NoPopulation: 'Campo "População" está vazio',
    NoAvarage: 'Campo "Renda Média" está vazio',
    NoState: 'Campo "Estado" está vazio',
    NoFoundation: 'Campo "Fundado em" está vazio',
    AlredyExist: 'Cidade já está cadastrada',
    NotInteger: 'O campo "Populacão" precisa ser um numero inteiro',
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
    state: 'State',
    foundation: 'Founded on',
    create: 'Create',
    creating: 'Creating',
    close: 'Close',
    citySuccessCreated: 'The City was successfully registered.',
  },
  formCityError: {
    NoName: 'Field "name" is empity',
    NoPopulation: 'Field "population" is empity',
    NoAvarage: 'Field "Avarage Income" is empity',
    NoState: 'Field "State" is empity',
    NoFoundation: 'Field "Foundation" is empity',
    AlredyExist: 'City alredy exists',
    NotInteger: 'Field "Population" must be an integer',
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
    states: statesBR,
    isLoading: false,
    formError: null,
    cityData: {
      "name": "",
      "population_count": null,
      "avarage_income": null,
      "state": "",
      "foundation_date": null,
    },
    cityList: [],
    search: "",
    cityNotFound: false,
    citySuccessCreated: false,
  },
  methods: {
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

    cleanFormData: function () {
      this.cityData = {
        "name": "",
        "population_count": null,
        "avarage_income": null,
        "state": "",
        "foundation_date": null,
      };
      this.citySuccessCreated = false;
      this.formError = null;
      return;
    },

    createCity: function (cityData) {
      this.setLoadingState(false);
      if (!this.cityData.name) {
        this.formError = this.$t('formCityError.NoName');
        return;
      }
      if (!this.cityData.population_count) {
        this.formError = this.$t('formCityError.NoPopulation');
        return;
      }
      if (!this.cityData.avarage_income) {
        this.formError = this.$t('formCityError.NoAvarage');
        return;
      }
      if (!this.cityData.state) {
        this.formError = this.$t('formCityError.NoState');
        return;
      }
      if (!this.cityData.foundation_date) {
        this.formError = this.$t('formCityError.NoFoundation');
        return;
      }

      this.setLoadingState(true);
      axios.post('/api/v.1/city', cityData)
      .then((response) => {
          this.searchCity(cityData.name);
          this.search = cityData.name;
          this.setLoadingState(false);
          this.cleanFormData();
          this.citySuccessCreated = true;
        })
        .catch((error) => {
          this.setLoadingState(false);
          if (error.response.status === 400) {
            this.formError = this.$t('formCityError.AlredyExist');
            return;
          }
          if (error.response.status === 422) {
            if (error.response.data.detail[0].type === "type_error.integer") {
              this.formError = this.$t('formCityError.NotInteger');
            }
            return;
          }
        });
    },
  }
})
