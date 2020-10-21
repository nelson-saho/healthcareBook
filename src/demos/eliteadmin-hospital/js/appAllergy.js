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
        //App.listenForEvents();
        //return App.render();
      });

    },
      
    render: function() {
      
      var patientInstance;
      var patientId = parseInt(document.forms["formPatient"]["inputPatientId"].value);
      // Load account data
  
      // Load contract data
      App.contracts.Patient.deployed().then(function(instance) {
        patientInstance = instance;
        return patientInstance.allergyCountOfPatient(patientId);
      }).then(function(allergyCount) {
        var allergiesResults = $("#allergiesResult");
        allergiesResults.empty();
        
        patientInstance.getAllergies(patientId).then(function(allergies) {
        //let allergy = await patientInstance.getAllergies(patientId);
          //document.forms["formPatient"]["inputName"].value = allergyCount;
          for (var i = 0; i < allergyCount; i++) {
            
            patientInstance.getAllergy(allergies[i]).then(function(allergy) {
              var idAllergy = allergy[0];
              var name = allergy[1];
              var observation = allergy[2];

              var action = "<td class='text-nowrap'><a href='#' data-toggle='modal' data-target='#editAllergy' data-original-title='Edit'> <i class='fa fa-pencil text-inverse m-r-10'></i> </a> <a href='#' data-toggle='modal' data-target='#deleteAllergy' data-original-title='Close'> <i class='fa fa-close text-danger'></i> </a> </td>"
              var allergyTemplate = "<tr><th>" + idAllergy + "</th><td>" + name + "</td><td>" + observation + "</td>" + action + "</tr>";
              allergiesResults.append(allergyTemplate);
            });
          }
        });

      }).catch(function(error) {
        console.warn(error);
      });
      //$("#formPatient").get(0).reset();
      //$("#formAllergy").get(0).reset();
    },

    searchPatient: function() {
      var patientId = parseInt(document.forms["formPatient"]["inputPatientId"].value);
      App.contracts.Patient.deployed().then(function(instance) {     
        return instance.isPatient(patientId);
      }).then(function(find) {
        if (find) {
          //document.forms["formPatient"]["inputName"].value = patientId;  
          App.contracts.Patient.deployed().then(function(instance) {
            return instance.getThePatient(patientId);
          }).then(function(result){
            var name = result[0] + " " + result[1];
            var gender = result[2];
            document.forms["formPatient"]["inputName"].value = name;
            document.forms["formPatient"]["inputGender"].value = gender;
            App.render();
          });
        } else {
        }
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