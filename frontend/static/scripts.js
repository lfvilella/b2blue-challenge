moment.locale(this.locale);
var app = new Vue({
  el: '#app',
  data: {
    locale: 'pt-br',
    isLoading: false,
    cityData: {
      "name": "",
      "population_count": 0,
      "avarageIncome": 0,
      "country": "",
      "state": "",
      "foundationDate": "",
    },
    cityList: [],
    search: "",
  },
  methods: {
    changeLocale: function (locale) {
      this.locale = locale;
    },

    searchCity: function (search) {
      this.isLoading = true;
      this.getCity(search)
    },

    getCity: function (search) {
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
  }
})

$(function () {
  var states = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illnois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming"
  ];

  $('#city-autocomplete').autocomplete({
    source: states
  });
});
