App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Patient.json", function(patient) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Patient = TruffleContract(patient);
      // Connect provider to interact with contract
      App.contracts.Patient.setProvider(App.web3Provider);

      return App.render();
    });
  },
   
  render: function() {
    //var patientInstance;
    
    // Load contract data addThePatient
    App.contracts.Patient.deployed().then(function(instance) {
      patientInstance = instance;
      return patientInstance.counterPatient();  
      
    }).then(function(counterPatient) {
      var patientsResults = $("#patientsResults");
      patientsResults.empty();
      
      
      for(var i = 0; i<= counterPatient; i++) {
        patientInstance.patients(i).then(function(aPatient) {
          var id = aPatient[0];
          var firstName = aPatient[1];
          var lastName = aPatient[2];
          var gender = aPatient[3];
          var adressOfPatient = aPatient[4];

          var action = "<td class='text-nowrap'><a href='#' data-toggle='modal' data-target='#viewPatient' data-original-title='View'> <i class='fa fa-search text-inverse m-r-10'></i> </a><a href='edit-patient.html' data-original-title='Edit'> <i class='fa fa-pencil text-inverse m-r-10'></i> </a> <a href='#' data-toggle='modal' data-target='#deletePatient' data-original-title='Close'> <i class='fa fa-close text-danger'></i> </a> </td>"
          
          // Render doctor Result
          var patientTemplate = "<tr><th>" + id + "</th><td>" + firstName + "</td><td>" + lastName + "</td><td>" + gender + "</td><td>" + adressOfPatient + "</td>" + action + "</tr>";
          patientsResults.append(patientTemplate);
        });
      }

    }).catch(function(error) {
      console.warn(error);
    });
  },

  addThePatient: function() {
    var firstNamePatient = $("#inputFirstname1").val();
    var lastNamePatient = $("#inputLastname1").val();
    var adressPatient = $("#address").val();
    var genderPatient = document.querySelector('input[name="gender"]:checked').value;
    //var genderPatient = $("#inputDoctorAccount").val();
    //$("#test").html(firstNameDoctor + lastNameDoctor + hospitalAdressDoctor);
    App.contracts.Patient.deployed().then(function(instance) {
      return instance.addPatient(firstNamePatient, lastNamePatient, genderPatient, adressPatient);
    }).then(function(result) {
      // Reset the form
      $("#formAddPatient").reset(); //document.getElementById("formAddPatient").reset();
      

    }).catch(function(err) {
      console.error(err);
    });
  }


};
  
$(function() {
  $(window).load(function() {
    App.init();
  });
});