import sys
import json
import ipaddress

def calculate_network_solution(network_ip, departments):
    try:
        # Calculate total required IPs, including one extra IP for each switch port
        total_required_ips = sum(int(department['users']) + 3 for department in departments)  # +3 for each user, network, broadcast, and switch port IP
        ip_network = ipaddress.ip_network(network_ip, strict=False)
        
        if total_required_ips > ip_network.num_addresses:
            return {
                "errors": [
                    {
                        "message": "The provided network range is insufficient to accommodate the specified number of users and device ports. Consider using a larger network range."
                    }
                ]
            }
        
        # Keep the original order by adding an index to each department
        indexed_departments = [{'index': i, **dept} for i, dept in enumerate(departments)]
        
        result = allocate_subnets(network_ip, indexed_departments)
        
        if 'errors' in result:
            return result
        
        # Sort results back to the original order using the index
        result_sorted = sorted(result, key=lambda x: x['index'])
        
        return {
            "networkIp": network_ip,
            "departments": departments,
            "subnetAllocations": result_sorted
        }
    except Exception as e:
        print(f"Error in calculate_network_solution: {e}", file=sys.stderr)
        raise

def allocate_subnets(network_ip, departments):
    try:
        ip_network = ipaddress.ip_network(network_ip, strict=False)
        sorted_departments = sorted(departments, key=lambda x: int(x['users']), reverse=True)

        subnet_allocations = []
        errors = []
        current_subnet = ip_network.network_address

        for department in sorted_departments:
            required_ips = int(department['users']) + 3  # +3 for network, broadcast, and switch port addresses
            required_subnet_size = calculate_required_subnet_size(required_ips)
            subnet = find_next_subnet(ip_network, current_subnet, required_subnet_size)
            
            if not subnet:
                errors.append({
                    "department": department['index'] + 1,
                    "message": f"Department {department['index'] + 1} requires more IPs than available in the network range."
                })
                continue

            allocated_ips = list(subnet.hosts())

            subnet_allocations.append({
                "index": department['index'],
                "department": department['index'] + 1,
                "subnet": str(subnet),
                "allocated_ips_count": subnet.num_addresses - 2,  # Exclude network and broadcast addresses
                "ip_range": f"{allocated_ips[0]} - {allocated_ips[-1]}",
                "subnet_mask": str(subnet.netmask),
                "wildcard_mask": str(subnet.hostmask),
                "allocated_ips": [str(ip) for ip in allocated_ips],
                "switch_port_ip": str(allocated_ips[0])  # Assign the first IP to the switch port
            })

            # Move to the next subnet address for the next allocation
            current_subnet = next_subnet_address(subnet, required_subnet_size)

        if errors:
            return {"errors": errors}

        return subnet_allocations
    except Exception as e:
        print(f"Error in allocate_subnets: {e}", file=sys.stderr)
        raise

def calculate_required_subnet_size(required_ips):
    for new_prefix in range(32, 0, -1):
        if 2 ** (32 - new_prefix) >= required_ips:
            return new_prefix
    raise ValueError('No suitable subnet size found.')

def next_subnet_address(subnet, prefix):
    return subnet.network_address + (1 << (32 - prefix))

def find_next_subnet(ip_network, start_address, prefix):
    for subnet in ip_network.subnets(new_prefix=prefix):
        if subnet.network_address >= start_address:
            return subnet
    return None

if __name__ == "__main__":
    try:
        network_ip = sys.argv[1]
        departments = json.loads(sys.argv[2])
        result = calculate_network_solution(network_ip, departments)
        print(json.dumps(result))
    except Exception as e:
        print(f"Error in main: {e}", file=sys.stderr)
        raise
