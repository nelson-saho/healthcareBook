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
      $("#formAddDoctor").get(0).reset();
    },

    addTheDoctor: function() {
      var doctorAccount = $("#inputDoctorAccount").val();
      var firstNameDoctor = $("#inputFirstname1").val();
      var lastNameDoctor = $("#inputLastname1").val();
      var hospitalAdressDoctor = $("#inputHospitalAddress").val();
      //$("#test").html(firstNameDoctor + lastNameDoctor + hospitalAdressDoctor);
      App.contracts.Patient.deployed().then(function(instance) {
        return instance.addDoctor(firstNameDoctor, lastNameDoctor, hospitalAdressDoctor, doctorAccount);
      }).then(function(result) {
        // Reset the form
        //$("#formAddDoctor").reset(); //document.getElementById("formAddDoctor").reset();
        

      }).catch(function(err) {
        console.error(err);
      });
    },

    listenForEvents: function() {
      App.contracts.Patient.deployed().then(function(instance) {
        instance.NewDoctor({}, {
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