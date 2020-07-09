moment.locale(this.locale);
var app = new Vue({
  el: '#app',
  data: {
    locale: '',
    isLoading: false,
    city: {
      name: 'São Paulo',
      amountPeople: '12 180 000',
      avarageIncome: 1946.00,
      country: 'Brasil',
      state: 'SP',
      foundationDate: moment('09/07/1822').format('L'),
    }
  },
  methods: {
    changeLocale: function (locale) {
      this.locale = locale;
    },

    searchCity: function(){
        this.isLoading = true;
    }
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
