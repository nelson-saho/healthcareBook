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
        return App.render();
      });

    },
  
    render: function() {
      $("#formPatient").get(0).reset();
      $("#formMedicine").get(0).reset();
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
            App.contracts.Patient.deployed().then(function(instance) {
              return instance.counterAllergy();
            }).then(function(count) {
              //Initialiser le second formulaire
            });

          });
        } else {
          App.render();
        }
        

      }).catch(function(err) {
        console.error(err);
      });
    },
    
    addMedicine: function() {
      var documentCode = document.forms["formMedicine"]["inputDocumentCode"].value;
      var medicationCode = document.forms["formMedicine"]["inputMedicationCode"].value;
      var medicationName = document.forms["formMedicine"]["inputMedicationName"].value;
      var normalStartDate = document.forms["formMedicine"]["inputStartDate"].value;
      var normalEndDate = document.forms["formMedicine"]["inputEndDate"].value;
      var DosageUnit = document.forms["formMedicine"]["inputDosageUnit"].value;
      var DosageQuantity = parseInt(document.forms["formMedicine"]["inputDosageQuantity"].value);
      var prescriptionDate = document.forms["formMedicine"]["inputPrescriptionDate"].value;
      var observation = document.forms["formMedicine"]["inputObservations"].value;
      var patientId = parseInt(document.forms["formPatient"]["inputPatientId"].value);
    
      App.contracts.Patient.deployed().then(function(instance2) {
        return instance2.prescribeSpecialtyMedicine(documentCode,
          medicationCode,
          medicationName,
          normalStartDate,
          normalEndDate,
          DosageUnit,
          DosageQuantity,
          prescriptionDate,
          observation,
          patientId
        );
      }).then(function(result) {
        // Reset the form
        //$("#formAddPatient").get(0).reset(); //document.getElementById("formAddPatient").reset(); x
        $("#formMedicine").get(0).reset();
        
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