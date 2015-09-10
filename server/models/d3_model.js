
Meteor.methods ({

  d3Insert: function(count) {
    Things.insert({name: "thing " + (count + 1)});
  },

  d3Remove: function(count) {
    var id = Things.findOne({name: "thing " + count})['_id'];
    console.log("D3REMOVE "+count+" "+id)
      Things.remove({_id:id });
  }
});
