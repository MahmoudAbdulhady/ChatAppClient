using ChatAppAngular.Mapping;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;
using System.Security.Claims;

namespace ChatAppAngular
{
    [Authorize]
    public class ChatHub : Hub
    {
        private static readonly ConcurrentDictionary<string, HashSet<string>> ActiveSessions
        = new ConcurrentDictionary<string, HashSet<string>>();

        public async Task<string> StartChat()
        {
            var sessionId = Guid.NewGuid().ToString();
            var userConnectionId = Context.ConnectionId;

            // Initialize the session with the user who started the chat
            var isNewSessionAdded = ActiveSessions.TryAdd(sessionId, new HashSet<string> { userConnectionId });

            if (isNewSessionAdded)
            {
                // Add the user to the SignalR group
                await Groups.AddToGroupAsync(userConnectionId, sessionId);

                // Notify all clients about the new session
                await Clients.All.SendAsync("ChatSessionStarted", sessionId);
            }

            return sessionId;
        }


        public IEnumerable<string> GetActiveSessionIds()
        {
            return ActiveSessions.Keys;
        }

        public HashSet<string> GetSessionUsers(string sessionId)
        {
            if (ActiveSessions.TryGetValue(sessionId, out var users))
            {
                return users;
            }
            return new HashSet<string>();
        }


            public async Task JoinChatSession(string sessionId)
            {
                var user = Context.User;
                if (user.IsInRole("Admin"))
                {
                    if (ActiveSessions.ContainsKey(sessionId))
                    {
                        await Groups.AddToGroupAsync(Context.ConnectionId, sessionId);
                        await Clients.Group(sessionId).SendAsync("AdminJoined", user.Identity.Name, sessionId);
                    }
                    else
                    {
                        // Optionally handle the case where the session ID does not exist
                        // For example, send an error message back to the admin client
                        await Clients.Caller.SendAsync("SessionNotFound", sessionId);
                    }
                }
            }


        public async Task SendMessage(string sessionId, string message)
        {
            var userName = Context.User.Identity.Name;
            await Clients.Group(sessionId).SendAsync("ReceiveMessage", userName, message);

            //new 
            // Send an acknowledgment to the sender
            await Clients.Caller.SendAsync("MessageSent", message);
        }





        public override async Task OnDisconnectedAsync(Exception exception)
        {
            if (ActiveSessions.Values.Any(session => session.Remove(Context.ConnectionId)) &&
                !ActiveSessions.Values.Any(session => session.Contains(Context.ConnectionId)))
            {
                // Optional: Do something if a user disconnects and is not part of any sessions
            }

            // Optionally, clean up empty sessions
            var emptySessions = ActiveSessions.Where(kvp => kvp.Value.Count == 0).Select(kvp => kvp.Key).ToList();
            foreach (var sessionId in emptySessions)
            {
                ActiveSessions.TryRemove(sessionId, out _);
            }

            await base.OnDisconnectedAsync(exception);
        }
    }
}
