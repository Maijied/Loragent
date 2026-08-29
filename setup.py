from setuptools import setup, find_packages

setup(
    name='loragent',
    version='2.0.0',
    description='Universal Multi-Agent Ecosystem for Lorapok Labs — 224 Agents, 20 MCP Servers, and 6 Formations',
    author='Lorapok Labs',
    packages=find_packages(where='src'),
    package_dir={'': 'src'},
    scripts=['bin/install-officers.py'],
    include_package_data=True,
    classifiers=[
        'Programming Language :: Python :: 3',
        'Operating System :: OS Independent',
    ],
    python_requires='>=3.6',
)
