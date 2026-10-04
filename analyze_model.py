import json, struct

with open(r'D:\PortfolioProjects\Portfolio\assets\models\dragon.glb', 'rb') as f:
    magic, version, length = struct.unpack('<III', f.read(12))
    chunk_length, chunk_type = struct.unpack('<II', f.read(8))
    json_data = f.read(chunk_length)
    gltf = json.loads(json_data)

print('Meshes:', len(gltf.get('meshes',[])))
print('Materials:', len(gltf.get('materials',[])))

for i, m in enumerate(gltf.get('meshes',[])):
    name = m.get('name','unnamed')
    print('  Mesh %d: %s' % (i, name))

for i, m in enumerate(gltf.get('materials',[])):
    name = m.get('name','unnamed')
    pbr = list(m.get('pbrMetallicRoughness',{}).keys())
    alpha = m.get('alphaMode','OPAQUE')
    double = m.get('doubleSided', False)
    print('  Material %d: %s pbr=%s alpha=%s doubleSided=%s' % (i, name, pbr, alpha, double))

for i, n in enumerate(gltf.get('nodes',[])):
    name = n.get('name','unnamed')
    mesh = n.get('mesh','none')
    children = n.get('children',[])
    print('  Node %d: %s mesh=%s children=%s' % (i, name, mesh, children))
