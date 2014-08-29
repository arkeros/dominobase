ln -s /home/rafa/dominobase/webapp/components/dominoes /home/rafa/dominobase/webapp/bower_components 

haml app/index.html.haml > app/index.html
grunt build
cp app/scripts/param.js dist/scripts/param.js
cp app/images/params.svg dist/images/params.svg

ln -s /home/rafa/dominobase/webapp/bower_components /home/rafa/dominobase/webapp/dist 