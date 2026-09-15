// Updater custom para commit-and-tag-version: mantiene <Version> del csproj
// del backend sincronizado con la versión SemVer del proyecto.
const VERSION_TAG_RE = /<Version>[^<]*<\/Version>/;

module.exports.readVersion = function readVersion(contents) {
  const match = contents.match(VERSION_TAG_RE);
  if (!match) return '0.0.0';
  return match[0].replace(/<\/?Version>/g, '');
};

module.exports.writeVersion = function writeVersion(contents, version) {
  if (VERSION_TAG_RE.test(contents)) {
    return contents.replace(VERSION_TAG_RE, `<Version>${version}</Version>`);
  }
  // Si el csproj todavía no tiene <Version>, la insertamos en el primer PropertyGroup.
  return contents.replace(
    /<PropertyGroup>/,
    `<PropertyGroup>\n    <Version>${version}</Version>`
  );
};
