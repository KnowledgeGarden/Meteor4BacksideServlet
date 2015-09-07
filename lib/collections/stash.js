/**
 * Stash is a local-only persistent personal/group collection of  URLs with notes
 {id: [
      {url: {
          note,
          note,
          note,
        }}
    ]}
    where id is userId or groupId
    Stash form allows to select where to stash
 */


Stash = new Mongo.Collection("stash");
