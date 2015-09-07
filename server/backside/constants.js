Meteor.methods({
  //VERBS
 ADD_FEATURES_TO_TOPIC: function() {return "AddFeatures"}, //topicmap
     //NOTE: AddFeatures can handle TAG_NAMES_PROP and URL_PROP
     //TODO add more features to BacksideServlet for that
 GET_TOPIC:             function() {return "GetTopic"}, //topicmap
 GET_TOPIC_BY_URL:      function() {return "GetByURL"}, //topicmap
 PUT_TOPIC:             function() {return "PutTopic"}, //topicmap
 REMOVE_TOPIC:          function() {return "RemTopic"}, //topicmap
 NEW_INSTANCE_TOPIC:    function() {return "NewInstance"}, //topicmap
 NEW_SUBCLASS_TOPIC:    function() {return "NewSub"}, //topicmap
 NEW_USER:              function() {return "NewUser"}, //userapp
 LIST_INSTANCE_TOPICS:  function() {return "ListInstances"}, //topicmap
 LIST_SUBCLASS_TOPICS:  function() {return "ListSubclasses"}, //topicmap
 LIST_USERS:            function() {return "ListUsers"}, //topicmap & userapp
 GET_USER:              function() {return "GetUser"}, // userappE
 AUTHENTICATE:          function() {return 'Auth'},
 VALIDATE:              function() {return 'Validate'},
 NEW_INVITE:            function() {return 'NewInvite'},
 REMOVE_INVITE:         function() {return 'RemoveInvite'},
 LIST_INVITES:          function() {return 'ListInvites'},
 UPDATE_ROLE:           function() {return 'UpdUsRol'},
 UPDATE_EMAIL:          function() {return 'UpdUsEma'},
 UPDATE_PASSWORD:       function() {return 'UpdUsPwd'},
 LOAD_TREE:             function() {return 'LoadTree'},
 ADD_PIVOT:             function() {return 'AddPivot'},
 ADD_RELATION:          function() {return 'AddRelation'},
 FIND_OR_PROCESS_TAG:   function() {return 'FindProcessTag'},
 FIND_OR_CREATE_BOOKMARK: function() {return 'FindProcessBookmark'},
 //NODE PROPERTIES
 CREATORID_PROP:        function() {return "crtr"},
 DETAILS_PROP:          function() {return "details"},
 INSTANCE_OF_PROP:      function() {return "inOf"},
 IS_PRIVATE_PROP:       function() {return "isPrv"}, // takes 't' or 'f' case insensitive
 LABEL_PROP:            function() {return "label"},
 LANGUAGE_PROP:         function() {return "Lang"},
 LARGE_IMAGE_PROP:      function() {return "lIco"},
 SMALL_IMAGE_PROP:      function() {return "sIco"},
 LOCATOR_PROP:          function() {return "lox"},
 SUBCLASS_OF_PROP:      function() {return "sbOf"},
 TAG_NAMES_PROP:        function() {return "TagNames"},  //takes an array [name, name, name]
 URL_PROP:              function() {return "url"},
 LIST_PROPERTY:         function() {return "ListProperty"}, //topicmap
 //NODE TYPES
 BOOKMARK_NODE_TYPE:    function() {return "BookmarkNodeType"},
 CHALLENGE_TYPE:        function() {return "ChallengeNodeType"},
 ISSUE_TYPE:            function() {return "IssueNodeType"},
 EVIDENCE_TYPE:         function() {return "EvidenceNodeType"},
 CLAIM_TYPE:            function() {return "ClaimNodeType"},
 RESOURCE_TYPE:         function() {return "ResourceNodeType"},
 GUILD_TYPE:            function() {return "GuildNodeType"},
 QUEST_TYPE:            function() {return "QuestNodeType"},
 AVATAR_TYPE:           function() {return "AvatarNodeType"},
 TAG_TYPE:              function() {return "TagNodeType"},
 THEME_TYPE:            function() {return "ThemeNodeType"},
 PRO_TYPE:              function() {return "ProNodeType"},
 CON_TYPE:              function() {return "ConNodeType"},
 SOLUTION_TYPE:         function() {return "SolutionNodeType"},
 POSITION_TYPE:         function() {return "PositionNodeType"},
 CONVERSATION_MAP_TYPE: function() {return "ConversationMapNodeType"},
 ONTOLOGY_NODE_TYPE:    function() {return "OntologyNodeType"},
 GRAPH_NODE_TYPE:       function() {return "GraphNodeType"},
 //RELATIONS
 DOCUMENT_CREATOR_RELN: function() {return "DocumentCreatorRelationType"},
 TAG_BOOKMARK_RELN:     function() {return "TagDocumentRelationType"},
 //IMAGES
 CLASS_ICON:            function() {return "/images/cogwheel.png"},
 CLASS_ICON_SM:         function() {return "/images/cogwheel_sm.png"},
 RELATION_ICON:         function() {return "/images/cogwheels.png"},
 RELATION_ICON_SM:      function() {return "/images/cogwheels_sm.png"},
 PROPERTY_ICON:         function() {return "/images/snowflake.png"},
 PROPERTY_ICON_SM:      function() {return "/images/snowflake_sm.png"},
 PERSON_ICON:           function() {return "/images/person.png"},
 PERSON_ICON_SM:        function() {return "/images/person_sm.png"},
 GROUP_ICON:            function() {return "/images/group.png"},
 GROUP_ICON_SM:         function() {return "/images/group.png"},
 ISSUE:                 function() {return "/images/ibis/issue.png"},
 ISSUE_SM:              function() {return "/images/ibis/issue_sm.png"},
 POSITION:              function() {return "/images/ibis/position.png"},
 POSITION_SM:           function() {return "/images/ibis/position_sm.png"},
 CLAIM:                 function() {return "/images/ibis/claim.png"},
 CLAIM_SM:              function() {return "/images/ibis/claim_sm.png"},
 REFERENCE:             function() {return "/images/ibis/reference.png"},
 REFERENCE_SM:          function() {return "/images/ibis/reference_sm.png"},
 PRO:                   function() {return "/images/ibis/plus.png"},
 PRO_SM:                function() {return "/images/ibis/plus_sm.png"},
 CON:                   function() {return "/images/ibis/minus.png"},
 CON_SM:                function() {return "/images/ibis/minus_sm.png"},
 MAP:                   function() {return "/images/ibis/map.png"},
 MAP_SM:                function() {return "/images/ibis/map_sm.png"},
 CHALLENGE:             function() {return "/images/ibis/challenge.png"},
 CHALLENGE_SM:          function() {return "/images/ibis/challenge_sm.png"},
 SOLUTION:              function() {return "/images/ibis/decision.png"},
 SOLUTION_SM:           function() {return "/images/ibis/decision_sm.png"},
 PROJECT:               function() {return "/images/project.png"},
 PROJECT_SM:            function() {return "/images/project_sm.png"},
 ONTOLOGY:              function() {return "/images/ontology.png"},
 ONTOLOGY_SM:           function() {return "/images/ontology_sm.png"},
 PUBLICATION:           function() {return "/images/publication.png"},
 PUBLICATION_SM:        function() {return "/images/publication_sm.png"},
 LITERATURE_ANALYS:     function() {return "/images/literature-analysis.png"},
 LITERATURE_ANALYS_SM:  function() {return "/images/literature-analysis_sm.png"},
 ORGANIZATION:          function() {return "/images/organization.png"},
 ORGANIZATION_SM:       function() {return "/images/organization_sm.png"},
 BOOKMARK:              function() {return "/images/bookmark.png"},
 BOOKMARK_SM:           function() {return "/images/bookmark_sm.png"},
 TAG:                   function() {return "/images/tag.png"},
 TAG_SM:                function() {return "/images/tag_sm.png"},
 THEME:                 function() {return "/images/theme.png"},
 THEME_SM:              function() {return "/images/theme_sm.png"},
 LINK:                  function() {return "/images/link.png"},
 LINK_SM:               function() {return "/images/link_sm.png"}

});
