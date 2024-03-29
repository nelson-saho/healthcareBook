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
      App.listenForEvents();
      return App.render();
    });
  },
   
  render: function() {
    //var patientInstance;
    
    // Load contract data addThePatient
    $("#formAddPatient").get(0).reset();
  },

  /*searchDoctor: function() {
    var doctorId = parseInt(document.forms["formDoctor"]["inputDoctorId"].value);
  
    App.contracts.Patient.deployed().then(function(instance) {
      
      return instance.isDoctor(doctorId);
    }).then(function(find) {
      if (find) {
        //document.forms["formPatient"]["inputName"].value = patientId;  
        App.contracts.Patient.deployed().then(function(instance) {
          return instance.getTheDoctor(doctorId);
        }).then(function(result){
          
          var name = result[0] + " " + result[1];
          var addressHospital = result[2];
          document.forms["formDoctor"]["inputName"].value = name;
          document.forms["formDoctor"]["inputHospitalAddress"].value = addressHospital;
          //Activer le second formulaire

        });
      } else {
        App.render();
      }
      

    }).catch(function(err) {
      console.error(err);
    });
  },*/

  addThePatient: function() {
    var firstNamePatient = $("#inputFirstname1").val();
    var lastNamePatient = $("#inputLastname1").val();
    var adressPatient = $("#address").val();
    var genderPatient = document.querySelector('input[name="gender"]:checked').value;
    App.contracts.Patient.deployed().then(function(instance) {
      return instance.addPatient(firstNamePatient, lastNamePatient, genderPatient, adressPatient);
    }).then(function(result) {
      // Reset the form
      //$("#formAddPatient").get(0).reset(); //document.getElementById("formAddPatient").reset(); x
      

    }).catch(function(err) {
      console.error(err);
    });
  },

  listenForEvents: function() {
    App.contracts.Patient.deployed().then(function(instance) {
      instance.NewPatient({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload page
        App.render();
      });
    });
  }


};
  
$(function() {
  $(window).load(function() {
    App.init();
  });
});