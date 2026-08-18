from setuptools import setup, find_packages

setup(
    name='loragent',
    version='1.0.0',
    description='Professional virtual office system for loragent Labs (32 Agent Mega-Agency)',
    author='loragent Labs',
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
