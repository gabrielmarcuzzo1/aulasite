import unittest
from pathlib import Path
from zipfile import ZipFile
from html.parser import HTMLParser


class References(HTMLParser):
    def __init__(self):
        super().__init__()
        self.paths = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        path = attrs.get("src") if tag == "script" else attrs.get("href") if tag == "link" else None
        if path:
            self.paths.append(path)


class CpanelPackageTest(unittest.TestCase):
    def test_archive_permissions_and_assets(self):
        root = Path(__file__).resolve().parents[1]
        with ZipFile(root / "downloads/agencia-v3-cpanel.zip") as archive:
            self.assertIsNone(archive.testzip())
            self.assertIn("assets/", archive.namelist())
            self.assertIn("index.html", archive.namelist())
            for item in archive.infolist():
                expected = 0o755 if item.is_dir() else 0o644
                self.assertEqual((item.external_attr >> 16) & 0o777, expected, item.filename)
                self.assertFalse(item.filename.startswith(("/", "dist/", "../")))
            html = archive.read("index.html").decode()
            self.assertNotIn("/src/main.tsx", html)
            references = References()
            references.feed(html)
            self.assertGreaterEqual(len(references.paths), 3)
            for path in references.paths:
                self.assertTrue(path.startswith("./"), path)
                self.assertIn(path[2:], archive.namelist())


if __name__ == "__main__":
    unittest.main()
