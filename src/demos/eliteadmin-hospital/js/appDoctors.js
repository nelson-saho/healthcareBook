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
      var patientInstance;
      // Load account data
      web3.eth.getCoinbase(function(err, account) {
        if (err === null) {
          App.account = account;
          $("#accountAddress").html("Your Account: " + account);
        }
      });
  
      // Load contract data
      App.contracts.Patient.deployed().then(function(instance) {
        patientInstance = instance;
        return patientInstance.counterDoctor();
      }).then(function(counterDoctor) {
        var doctorsResults = $("#doctorsResults");
        doctorsResults.empty();
      
        for (var i = 0; i <= counterDoctor; i++) {
          patientInstance.doctors(i).then(function(doctor) {
            var id = doctor[0];
            var firstName = doctor[1];
            var lastName = doctor[2];
            var hospitalAdress = doctor[3];

            var action = "<td class='text-nowrap'><a href='#' data-toggle='modal' data-target='#viewDoctor' data-original-title='View'> <i class='fa fa-search text-inverse m-r-10'></i> </a><a href='edit-doctor.html' data-original-title='Edit'> <i class='fa fa-pencil text-inverse m-r-10'></i> </a> <a href='#' data-toggle='modal' data-target='#deleteDoctor' data-original-title='Close'> <i class='fa fa-close text-danger'></i> </a> </td>"
      
            // Render doctor Result
            var doctorTemplate = "<tr><th>" + id + "</th><td>" + firstName + "</td><td>" + lastName + "</td><td>" + hospitalAdress + "</td>" + action + "</tr>";
            doctorsResults.append(doctorTemplate);
          });
        }
      }).catch(function(error) {
        console.warn(error);
      });
    }

  };
  
  $(function() {
    $(window).load(function() {
      App.init();
    });
  });