"""Package only the compiled site, with explicit shared-hosting permissions."""
from pathlib import Path
from stat import S_IFDIR, S_IFREG
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED, ZIP_STORED

root = Path(__file__).resolve().parents[1]
dist = root / "dist"
if not (dist / "index.html").is_file():
    raise SystemExit("Execute npm run build antes de gerar o pacote.")

output = root / "downloads" / "agencia-v3-cpanel.zip"
output.parent.mkdir(parents=True, exist_ok=True)
with ZipFile(output, "w") as archive:
    for path in sorted(dist.rglob("*")):
        if path.is_symlink():
            raise ValueError(f"Link simbólico inesperado no build: {path}")
        directory = path.is_dir()
        item = ZipInfo.from_file(path, path.relative_to(dist).as_posix())
        item.create_system = 3
        item.external_attr = ((S_IFDIR | 0o755) if directory else (S_IFREG | 0o644)) << 16
        if directory:
            item.external_attr |= 0x10
        item.compress_type = ZIP_STORED if directory else ZIP_DEFLATED
        archive.writestr(item, b"" if directory else path.read_bytes())

with ZipFile(output) as archive:
    assert archive.testzip() is None, "O pacote não passou na verificação de integridade."
print(f"Pacote cPanel: {output} (pastas 755, arquivos 644)")
