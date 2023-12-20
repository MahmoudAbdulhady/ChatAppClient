namespace ChatAppAngular.Mapping
{
    public class ConnectionMapping<T>
{
    private readonly Dictionary<T, HashSet<string>> _connections = new Dictionary<T, HashSet<string>>();

    public void Add(T key, string connectionId)
    {
        lock (_connections)
        {
            if (!_connections.TryGetValue(key, out var connections))
            {
                connections = new HashSet<string>();
                _connections[key] = connections;
            }

            connections.Add(connectionId);
        }
    }

    public void Remove(T key, string connectionId)
    {
        lock (_connections)
        {
            if (!_connections.TryGetValue(key, out var connections))
            {
                return;
            }

            connections.Remove(connectionId);

            if (connections.Count == 0)
            {
                _connections.Remove(key);
            }
        }
    }

    public IEnumerable<string> GetConnections(T key)
    {
        if (_connections.TryGetValue(key, out var connections))
        {
            return connections;
        }

        return Enumerable.Empty<string>();
    }
}
}
