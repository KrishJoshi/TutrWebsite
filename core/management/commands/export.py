import csv
from django.core.management.base import BaseCommand

from core.serializers import CsvSerializer, CSV_FIELDS
from core.models import CuratedStory


class Command(BaseCommand):
    help = 'Dump the accepted stories to CSV for export to Acxiom'
    fields = CSV_FIELDS

    def add_arguments(self, parser):
        # Named (optional) arguments
        parser.add_argument('-o', '--output-file',
                            default='/tmp/stories.csv',
                            dest='file',
                            help='Specify the output filename')

    def handle(self, *args, **options):
        stories = CuratedStory.objects.filter(dummy_content=False)
        serializer = CsvSerializer(stories, many=True)
        data = serializer.data
        self._write_csv(data, options['file'])

    def _write_csv(self, data, output_file):
        f = open(output_file, 'w+')
        writer = csv.writer(f)
        writer.writerow(self.fields)
        for obj in data:
            row = [self._get_data_item(obj, field) for field in self.fields]
            writer.writerow(row)
        f.close()

        print 'Data written to %s' % output_file

    def _get_data_item(self, obj, field):
        if "." in field:
            key, remainder = field.split(".", 1)
            return self._get_data_item(obj[key], remainder)
        else:
            data = obj[field]
            if type(data) == unicode:
                return data.encode('utf-8')
            else:
                return data
