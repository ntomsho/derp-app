requester = { 'id': invite.requester.id ,'type': invite.requester.class.name }
invite.requester.class.name == "Campaign" ? requester['title'] = invite.requester.title : requester['username'] = invite.requester.username
requested = { 'id': invite.requested.id ,'type': invite.requested.class.name }
invite.requested.class.name == "Campaign" ? requested['title'] = invite.requested.title : requested['username'] = invite.requested.username

json.extract! invite, :id, :created_at

json.requester requester
json.requested requested